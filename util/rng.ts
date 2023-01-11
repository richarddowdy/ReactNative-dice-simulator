export const RNG = (num: number): number => {
  // Return random number 1 through num
  return Math.ceil(Math.random() * num);
};
