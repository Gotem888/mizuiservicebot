export let userList = [];
export const uniqueUserList = (arr) => {
  const result = arr.filter(
    (
      (el) => (f) =>
        !el.has(f.user) && el.add(f.user)
    )(new Set())
  );
  return result;
};
