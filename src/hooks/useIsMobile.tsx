const getMobileDetect = (userAgent: NavigatorID['userAgent']) => {
  const isAndroid = () => Boolean(userAgent.match(/Android/i));
  const isIos = () => Boolean(userAgent.match(/iPhone|iPad|iPod/i));
  const isOpera = () => Boolean(userAgent.match(/Opera Mini/i));
  const isWindows = () => Boolean(userAgent.match(/IEMobile/i));
  const isMobile = () => Boolean(isAndroid() || isIos() || isOpera() || isWindows());
  return isMobile();
};

export const useIsMobile = () => {
  const userAgent = typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent;

  return getMobileDetect(userAgent);
};
