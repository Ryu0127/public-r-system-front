import ReactGA from 'react-ga4';

export const initGA = () => {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (measurementId) {
    ReactGA.initialize(measurementId);
  }
};

export const logPageView = (path) => {
  ReactGA.send({ hitType: 'pageview', page: path });
};

export const logEvent = (category, action, label) => {
  ReactGA.event({
    category,
    action,
    label,
  });
};