import express from "express";
import axios from "axios";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3000;

const tag = "under_30_minutes";
const name_rec = "bagel";

const tag_select = (param) => {
  const options = {
    method: "GET",
    url: "https://tasty.p.rapidapi.com/recipes/list",
    params: { tags: param },
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
      let data = response.data;

      let recipes = data.results.map((recipe) => ({
        url: recipe.thumbnail_url,
        title: recipe.name,
        cook_time: recipe.cook_time_minutes,
        nutrition: recipe.nutrition,
        tags: recipe.tags.map((tag) => tag.display_name),
        score: recipe.user_ratings.score,
        description: recipe.description,
        ingredients: recipe.sections[0].components.map((i) => i.raw_text),
        instructions: recipe.instructions.map((ins) => ins.display_text),
        time: recipe.total_time_tier,
      }));
      fs.writeFile("recipes.json", JSON.stringify(recipes), function (err) {
        if (err) throw err;
        console.log("Saved!");
      });

      res.status(200).send(recipes);
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

app.get(
  `/search_specific/${name_rec.toLocaleLowerCase().replace(/\s/g, "")}`,
  async (req, res) => {
    let data = JSON.parse(fs.readFileSync("recipes.json"));

    const result = data.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(name_rec) ||
        recipe.description.toLowerCase().includes(name_rec)
    );

    res.status(200).send(result);
  }
);
app.listen(PORT, (req, res) => {
  console.log(`Server listening on ${PORT}`);
});
