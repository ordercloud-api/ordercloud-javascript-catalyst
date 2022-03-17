export function GetToken(req): string {
    var authHeader: string = req.get("Authorization");
    if (!authHeader) return null;

    var parts = authHeader.split(" ");

    if (parts.length != 2 || parts[0] != "Bearer") {
        return null;
    }

    return parts[1];
}