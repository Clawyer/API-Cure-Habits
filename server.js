import express from "express";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3000;

const tag = "under_30_minutes";
const name_rec = "chicken soup";


const tag_select = (param) => {
  const options = {
    method: "GET",
    url: "https://tasty.p.rapidapi.com/recipes/list",
    params: { from: "0", size: "20", tags: param },
    headers: {
      "X-RapidAPI-Host": "tasty.p.rapidapi.com",
      "X-RapidAPI-Key": "06cb834762mshcb22960f6932b73p10db55jsn36667a1d2d74",
    },
  };
  return options;
};
const search = (param) => {
  const options = {
    method: "GET",
    url: "https://tasty.p.rapidapi.com/recipes/list",
    params: { prefix: param },
    headers: {
      "X-RapidAPI-Host": "tasty.p.rapidapi.com",
      "X-RapidAPI-Key": "06cb834762mshcb22960f6932b73p10db55jsn36667a1d2d74",
    },
  };
  return options;
};

app.get(`/all_recipes/${tag}`, async (req, res) => {
  axios
    .request(tag_select(tag))
    .then(function (response) {
      let count = response.data.count;
      let results = response.data;

    //   let recipes = results.map((recipe) => ({
    //     url: recipe.thumbnail_url,
    //     title: recipe.seo_title,
    //     cook_time: recipe.cook_time_minutes,
    //     nutrition: recipe.nutrition,
    //     ingredients: recipe.sections[0].components,
    //     tags: recipe.sections[0].tags,
    //     score: recipe.sections[0].user_ratings,
    //     time: recipe.sections[0].total_time_tier,
    //     description: recipe.sections[0].description,
    //     instructions: recipe.sections[0].instructions,
    //   }));


      res.status(200).send(results);
    })
    .catch(function (error) {
      console.error(error);
    });
});

app.get("/search_recipe", async (req, res) => {
  axios
    .request(search(name_rec))
    .then(function (response) {
      res.status(200).send(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
});

app.listen(PORT, (req, res) => {
  console.log(`Server listening on ${PORT}`);
});
