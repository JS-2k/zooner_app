namespace Zooner.Api.Services.Location;

public static class GeoLocationHelper
{
    private const double EarthRadiusKm = 6371.0;

    public static double CalculateDistanceKm(double lat1, double lon1, double lat2, double lon2)
    {
        var dLat = ToRadians(lat2 - lat1);
        var dLon = ToRadians(lon2 - lon1);

        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        return Math.Round(EarthRadiusKm * c, 2);
    }

    public static (double MinLat, double MaxLat, double MinLon, double MaxLon) GetBoundingBox(double lat, double lon, double radiusKm)
    {
        var latDelta = radiusKm / 111.0;
        var radLat = ToRadians(lat);
        var cosLat = Math.Cos(radLat);
        
        // Prevent division by zero near poles
        var lonDelta = Math.Abs(cosLat) > 0.0001 ? radiusKm / (111.0 * cosLat) : radiusKm / 111.0;

        return (lat - latDelta, lat + latDelta, lon - Math.Abs(lonDelta), lon + Math.Abs(lonDelta));
    }

    private static double ToRadians(double degrees) => degrees * Math.PI / 180.0;
}
