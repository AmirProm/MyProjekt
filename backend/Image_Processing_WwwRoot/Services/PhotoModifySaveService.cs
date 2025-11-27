using Image_Processing_WwwRoot.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using MongoDB.Bson;
using SkiaSharp;

namespace Image_Processing_WwwRoot.Services;

public sealed class PhotoModifySaveService : IPhotoModifySaveService
{
    private readonly IWebHostEnvironment _env;

    public PhotoModifySaveService(IWebHostEnvironment env)
    {
        _env = env ?? throw new ArgumentNullException(nameof(env));
    }

    #region Constants & Enums

    private const string StorageRoot = "storage/photos/";

    private static readonly string[] Operations =
    [
        "resize-scale",
        "resize-pixel",
        "resize-pixel-square",
        "crop",
        "original"
    ];

    private enum Operation
    {
        ResizeByScale,
        ResizeByPixel,
        ResizeByPixelSquare,
        Crop,
        Original
    }

    private readonly struct StandardSize(int side1, int side2)
    {
        public int Side1 { get; } = side1;
        public int Side2 { get; } = side2;
    }

    private static readonly StandardSize[] Dimensions =
    {
        new(1920, 1080),
        new(1080, 1080),
        new(1280, 720),
        new(1024, 768),
        new(800, 800),
        new(400, 400)
    };

    private static readonly SKSamplingOptions PhotoSampling =
        new(SKFilterMode.Linear, SKMipmapMode.Linear);

    #endregion

    #region Resize Methods

    public async Task<string> ResizeImageByScale(IFormFile formFile, ObjectId userId, int standardSizeIndex)
    {
        ArgumentNullException.ThrowIfNull(formFile);
        if (standardSizeIndex < 0 || standardSizeIndex >= Dimensions.Length)
            throw new ArgumentOutOfRangeException(nameof(standardSizeIndex));

        if (formFile.Length < 300_000)
            return await SaveImageAsIs(formFile, userId, (int)Operation.Original);

        using SKImage img = LoadImage(formFile);
        using SKBitmap bmp = SKBitmap.FromImage(img);

        (int w, int h) = GetTargetSize(bmp.Width, bmp.Height, standardSizeIndex);

        using SKBitmap resized = bmp.Resize(new SKImageInfo(w, h), PhotoSampling)
            ?? throw new InvalidOperationException($"Resize failed for target {w}×{h}.");

        using SKImage result = SKImage.FromBitmap(resized);
        using SKData data = result.Encode(SKEncodedImageFormat.Webp, 90);

        return await SaveImage(data, userId, formFile.FileName, (int)Operation.ResizeByScale);
    }

    public async Task<string> ResizeByPixel(IFormFile formFile, ObjectId userId, int widthIn, int heightIn)
    {
        ArgumentNullException.ThrowIfNull(formFile);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(widthIn);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(heightIn);

        using SKImage img = LoadImage(formFile);

        if (widthIn >= img.Width || heightIn >= img.Height)
            return await SaveImageAsIs(formFile, userId, (int)Operation.Original);

        using SKBitmap srcBmp = SKBitmap.FromImage(img);
        using SKBitmap scaled = srcBmp.Resize(new SKImageInfo(widthIn, heightIn), PhotoSampling)
            ?? throw new InvalidOperationException($"Resize failed for {widthIn}×{heightIn}.");

        using SKImage result = SKImage.FromBitmap(scaled);
        using SKData data = result.Encode(SKEncodedImageFormat.Webp, 90);

        return await SaveImage(data, userId, formFile.FileName, (int)Operation.ResizeByPixel, widthIn, heightIn);
    }

    public async Task<string> ResizeByPixel_Square(IFormFile formFile, ObjectId userId, int sideIn)
    {
        ArgumentNullException.ThrowIfNull(formFile);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(sideIn);

        using SKImage img = LoadImage(formFile);

        if (img.Width == img.Height && sideIn >= img.Width)
            return await SaveImageAsIs(formFile, userId, (int)Operation.Original);

        int minSide = Math.Min(img.Width, img.Height);
        if (sideIn >= minSide)
            return await CropWithOriginalSide_Square(formFile, userId);

        using SKImage cropped = CropCentered(img, minSide, minSide);
        using SKBitmap croppedBmp = SKBitmap.FromImage(cropped);
        using SKBitmap scaled = croppedBmp.Resize(new SKImageInfo(sideIn, sideIn), PhotoSampling)
            ?? throw new InvalidOperationException($"Resize failed for {sideIn}×{sideIn}.");

        using SKImage result = SKImage.FromBitmap(scaled);
        using SKData data = result.Encode(SKEncodedImageFormat.Webp, 90);

        return await SaveImage(data, userId, formFile.FileName,
            (int)Operation.ResizeByPixelSquare, sideIn, sideIn);
    }

    #endregion

    #region Crop Methods

    public async Task<string> Crop(IFormFile formFile, ObjectId userId, int widthIn, int heightIn)
    {
        ArgumentNullException.ThrowIfNull(formFile);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(widthIn);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(heightIn);

        using SKImage img = LoadImage(formFile);

        if (widthIn >= img.Width && heightIn >= img.Height)
            return await SaveImageAsIs(formFile, userId, (int)Operation.Original);

        widthIn = Math.Min(widthIn, img.Width);
        heightIn = Math.Min(heightIn, img.Height);

        using SKImage cropped = CropCentered(img, widthIn, heightIn);
        using SKData data = cropped.Encode(SKEncodedImageFormat.Webp, 90);

        return await SaveImage(data, userId, formFile.FileName, (int)Operation.Crop, widthIn, heightIn);
    }

    public async Task<string> CropWithOriginalSide_Square(IFormFile formFile, ObjectId userId)
    {
        ArgumentNullException.ThrowIfNull(formFile);

        using SKImage img = LoadImage(formFile);

        if (img.Width == img.Height)
            return await SaveImageAsIs(formFile, userId, (int)Operation.Original);

        int side = Math.Min(img.Width, img.Height);
        using SKImage cropped = CropCentered(img, side, side);
        using SKData data = cropped.Encode(SKEncodedImageFormat.Webp, 90);

        return await SaveImage(data, userId, formFile.FileName, (int)Operation.Crop, side, side);
    }

    public async Task<string> Crop_Square(IFormFile formFile, ObjectId userId, int sideIn)
    {
        ArgumentNullException.ThrowIfNull(formFile);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(sideIn);

        using SKImage img = LoadImage(formFile);

        if (sideIn > img.Width && img.Width == img.Height)
            return await SaveImageAsIs(formFile, userId, (int)Operation.Original);

        int side = Math.Min(sideIn, Math.Min(img.Width, img.Height));
        using SKImage cropped = CropCentered(img, side, side);
        using SKData data = cropped.Encode(SKEncodedImageFormat.Webp, 90);

        return await SaveImage(data, userId, formFile.FileName, (int)Operation.Crop, side, side);
    }

    #endregion

    #region Save Methods

    private async Task<string> SaveImage(SKData data, ObjectId userId,
        string fileName, int operation, int? width = null, int? height = null)
    {
        ArgumentNullException.ThrowIfNull(data);

        string folder = Path.Combine(_env.WebRootPath, StorageRoot,
            userId.ToString(), Operations[operation]);

        if (width is not null && height is not null)
            folder = Path.Combine(folder, $"{width}x{height}");

        Directory.CreateDirectory(folder);

        string uniqueName = $"{Guid.NewGuid():N}_{ToWebpName(fileName)}";
        string filePath = Path.Combine(folder, uniqueName);

        await using var fs = new FileStream(filePath, FileMode.Create,
            FileAccess.Write, FileShare.None, 81920, useAsync: true);
        using Stream stream = data.AsStream();
        await stream.CopyToAsync(fs);

        return filePath;
    }

    public async Task<string> SaveImageAsIs(IFormFile formFile, ObjectId userId, int operation)
    {
        ArgumentNullException.ThrowIfNull(formFile);

        string folder = Path.Combine(_env.WebRootPath, StorageRoot,
            userId.ToString(), Operations[operation]);
        Directory.CreateDirectory(folder);

        string uniqueName = $"{Guid.NewGuid():N}_{ToWebpName(formFile.FileName)}";
        string filePath = Path.Combine(folder, uniqueName);

        using SKImage img = LoadImage(formFile);
        using SKData data = img.Encode(SKEncodedImageFormat.Webp, 90);

        await using var fs = new FileStream(filePath, FileMode.Create,
            FileAccess.Write, FileShare.None, 81920, useAsync: true);
        using Stream s = data.AsStream();
        await s.CopyToAsync(fs);

        return filePath;
    }

    #endregion

    #region Helpers

    private static (int width, int height) GetTargetSize(int srcW, int srcH, int index)
    {
        StandardSize d = Dimensions[index];
        return srcW > srcH
            ? (d.Side1, d.Side2)
            : srcW < srcH
                ? (d.Side2, d.Side1)
                : (d.Side2, d.Side2);
    }

    private static SKImage LoadImage(IFormFile formFile)
    {
        using Stream input = formFile.OpenReadStream();
        SKImage img = SKImage.FromEncodedData(input)
            ?? throw new InvalidOperationException(
                $"Invalid or unsupported image data: '{formFile.FileName}'.");
        return img;
    }

    private static SKImage CropCentered(SKImage img, int width, int height)
    {
        int startX = Math.Max(0, (img.Width - width) / 2);
        int startY = Math.Max(0, (img.Height - height) / 2);
        return img.Subset(SKRectI.Create(startX, startY, width, height));
    }

    private static string ToWebpName(string input)
        => Path.GetFileNameWithoutExtension(input) + ".webp";

    #endregion
}
