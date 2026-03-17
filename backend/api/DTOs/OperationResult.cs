using System.Runtime.InteropServices;
using Microsoft.VisualStudio.Web.CodeGeneration.CommandLine;

namespace api.DTOs;

public record OperationResult<T>(
bool IsSucces,
[Optional] T Result,
CustomError? Error
);

public record OperationResult(
    bool IsSucces,
    CustomError? Error

);

public record CustomError(
    Enum Code,
    [Optional]  string? Massage
);