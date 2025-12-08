
export const exportData = (format, data) => {
  const plain = data.map((d) => ({
    id: d._id.toString(),
    locationInput: d.locationInput,
    normalizedLocation: d.normalizedLocation,
    startDate: d.startDate,
    endDate: d.endDate,
    temp: d.temperatures?.[0]?.temp ?? null,
    description: d.temperatures?.[0]?.description ?? "",
    humidity: d.temperatures?.[0]?.humidity ?? null,
    windSpeed: d.temperatures?.[0]?.windSpeed ?? null,

    mapsUrl: d.mapsUrl,
    createdAt: d.createdAt,
  }));

  // If format is JSON
  if (format === "json") {
    return {
      contentType: "application/json",
      filename: "weather.json",
      payload: JSON.stringify(plain, null, 2),
    };
  }

//If format is CSV (Excel-style)
  if (format === "csv") {
    const header =
      "id,locationInput,normalizedLocation,startDate,endDate,temp,description,mapsUrl,createdAt";

    const rows = plain.map((d) =>
      [
        d.id,
        d.locationInput,
        d.normalizedLocation,
        d.startDate.toISOString(),
        d.endDate.toISOString(),
        d.temp,
        `"${d.description}"`,
        d.mapsUrl,
        d.createdAt.toISOString(),
      ].join(",")
    );

    return {
      contentType: "text/csv",
      filename: "weather.csv",
      payload: [header, ...rows].join("\n"),
    };
  }

  if (format === "md") {
    const lines = plain.map(
      (d) =>
        `- **${d.normalizedLocation}** (${d.startDate
          .toISOString()
          .slice(0, 10)} → ${d.endDate
          .toISOString()
          .slice(0, 10)}): ${d.temp}°C, ${d.description} [Maps](${d.mapsUrl})`
    );

    return {
      contentType: "text/markdown",
      filename: "weather.md",
      payload: lines.join("\n"),
    };
  }

  //If format is not supported
  throw new Error("Unsupported format");
};
