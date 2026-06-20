export const getAllowedSidebarItems = (sidebarItems, allowedPermissions = []) => {
  return sidebarItems
    .map(section => ({
      ...section,
      items: section.items.filter(item => {
        if (!item.permission) return true;

        return allowedPermissions.includes(item.permission);
      }),
    }))
    .filter(section => section.items.length > 0);
};

export const getFirstAllowedHref = allowedSidebarItems => {
  for (const section of allowedSidebarItems) {
    for (const item of section.items) {
      if (item.href) return item.href;
      if (item.children?.[0]?.href) return item.children[0].href;
    }
  }

  return "";
};

export const isAllowedPath = (pathname, allowedSidebarItems) => {
  const allowedHrefs = [];
  const allowedSegments = new Set();

  allowedSidebarItems.forEach(section => {
    section.items.forEach(item => {
      if (item.href) {
        allowedHrefs.push(item.href);
        allowedSegments.add(`/${item.href.split("/")[1]}`);
      }

      item.children?.forEach(child => {
        allowedHrefs.push(child.href);
        allowedSegments.add(`/${child.href.split("/")[1]}`);
      });
    });
  });

  return (
    allowedHrefs.some(href => pathname === href || pathname.startsWith(`${href}/`)) ||
    [...allowedSegments].some(segment => pathname.startsWith(`${segment}/`))
  );
};
