export const COUPON_RULES = {
  WELCOME10: {
    label: "%10 indirim",
    type: "percent",
    value: 10,
    minSubtotal: 0,
  },
  SAVE150: {
    label: "150 TL indirim",
    type: "fixed",
    value: 150,
    minSubtotal: 2000,
  },
  MEGA20: {
    label: "%20 indirim (max 1200 TL)",
    type: "percent",
    value: 20,
    maxDiscount: 1200,
    minSubtotal: 5000,
  },
};

export const SHIPPING_FEE = 79.9;
export const FREE_SHIPPING_THRESHOLD = 3000;
