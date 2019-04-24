export default async (sec: number) =>
  new Promise((resolve, reject) =>
    setTimeout(() => resolve(), sec * 1000));