export const getDeadlineText = (deadline) => {
  const now = new Date();
  const end = new Date(deadline);

  const diff = end - now;
  if (diff <= 0) return "Expired";

  const hours = Math.floor(diff / (1000 * 60 * 60));

  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours < 24) return `${hours}h ${minutes}m left`;

  const days = Math.floor(hours / 24);
  return `${days} days left`;
};

export const getPostedTime = (createdAt) => {
  if (!createdAt) return "Posted recently";
  const now = new Date();
  const posted = new Date(createdAt);

  const diff = now - posted;

  const minutes = Math.floor(diff / (1000 * 60));

  if (minutes < 1) {
    return "Posted just now";
  }
  if (minutes < 60) {
    return `Posted: ${minutes}min ago`;
  }
  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `Posted: ${hours}hr ago`;
  }
  const days = Math.floor(hours / 24);

  return `Posted: ${days} day ago`;
};
