const menuItems = [
  `All movies`, `Watchlist`, `History`, `Favorites`
];

const generateMenuItems = () => {
  return menuItems.map((it) => {
    return {
      title: it,
      anchor: it.split(` `)[0].toLowerCase(),
      count: Math.floor(Math.random() * 10),
    };
  });
};

export {generateMenuItems};
