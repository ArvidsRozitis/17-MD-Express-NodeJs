import { readFileSync } from "fs";

type Article = {
  id: string;
  title: string;
  description: string;
};

type Articles = {
  articles: Article[];
};

const getArticlesFromFile = (): Articles => {
  const file = readFileSync("./src/db/db.json", "utf-8");

  const parseFileTextToJson = JSON.parse(file);

  return parseFileTextToJson;
};


export default getArticlesFromFile
