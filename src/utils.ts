export function distanceBetweenCoordinates(coords1: [number, number], coords2: [number, number]): number {
  function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  const [lat1, lon1] = coords1;
  const [lat2, lon2] = coords2;

  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km

  return Math.round(d * 10) / 10;
}

export function formatTitle(title: string) {
  return `${title} | Popos`
}