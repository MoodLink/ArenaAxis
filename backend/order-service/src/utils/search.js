export const fieldSearch = (query) => {
  let objectSearch = {
    keyword: "",
    regex: "",
  };

  if (query.keyword) {
    objectSearch.keyword = query.keyword;
    objectSearch.regex = new RegExp(query.keyword, "i");
  }

  console.log("Search Object:", objectSearch);

  return objectSearch;
};
