import axios from "axios";

export async function getAddress(lat: number, lng: number) {
  const response = await axios.get(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
  );

  if (!response.data) {
    throw new Error("Failed to fetch address!");
  }

  const address = response.data.address.city;
  return address;
}

export function getMapPreview(lat: number, lng: number) {
  const imagePreviewUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng},${lat},${lng},${lat}&layer=mapnik`;
  return imagePreviewUrl;
}
