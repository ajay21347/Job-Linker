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
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (minutes < 1) {
    return "Posted just now";
  }
  if (minutes < 60) {
    return `Posted: ${minutes} min ago`;
  }

  if (hours < 24) {
    return `Posted: ${hours} hr ago`;
  }
  if (days >= 1) {
    return `Posted  on : ${posted.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`;
  }
};

export const getPostedDate = (createdAt) => {
  if (!createdAt) return "";

  const posted = new Date(createdAt);

  return posted.toLocaleDateString("en-In", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
