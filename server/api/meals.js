const router = require("express").Router();
const { SingleFood } = require("../db/models");
module.exports = router;

router.get("/:date", async (req, res, next) => {
  try {
    if (req.user) {
      const allfoods = await SingleFood.findAll({
        where: { date: req.params.date, userId: req.user.id }
      });
      if (!allfoods) res.sendStatus(204);
      else res.json(allfoods);
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:barcodeId/:date/:mealType", async (req, res, next) => {
  try {
    if (req.user) {
      const toBeDestroyed = await SingleFood.findOne({
        where: {
          barcodeId: req.params.barcodeId,
          date: req.params.date,
          mealType: req.params.mealType,
          userId: req.user.id
        }
      });
      console.log(toBeDestroyed);

      if (!toBeDestroyed) res.sendStatus(204);
      else {
        console.log(toBeDestroyed);
        await toBeDestroyed.destroy();
        res.json(toBeDestroyed);
      }
    }
  } catch (error) {
    next(error);
  }
});

router.put("/edit", async (req, res, next) => {
  try {
    if (req.user) {
      const { barcodeId, date, mealType, servings } = req.body;
      console.log(req.body);
      const toBeUpdated = await SingleFood.findOne({
        where: {
          barcodeId: barcodeId,
          date: date,
          mealType: mealType,
          userId: req.user.id
        }
      });
      if (!toBeUpdated) res.sendStatus(204);
      else {
        toBeUpdated.servings = +servings;
        await toBeUpdated.save();
        res.json(toBeUpdated);
      }
    }
  } catch (error) {
    next(error);
  }
});

router.post("/add", async (req, res, next) => {
  try {
    if (req.user) {
      const {
        mealType,
        barcodeId,
        date,
        foodName,
        calories,
        carbs,
        fats,
        protein,
        cholesterol,
        fiber,
        potassium,
        sodium,
        sugar,
        brand,
        servingSize,
        servings
      } = req.body;

      const isRecordedItem = await SingleFood.findOne({
        where: {
          barcodeId: barcodeId,
          date: date,
          mealType: mealType,
          userId: req.user.id
        }
      });
      if (isRecordedItem) {
        isRecordedItem.servings = +servings;
        await isRecordedItem.save();
        res.json(isRecordedItem);
      } else {
        const newItem = await SingleFood.create({
          mealType,
          barcodeId,
          date,
          foodName,
          calories,
          carbs,
          fats,
          protein,
          cholesterol,
          fiber,
          potassium,
          sodium,
          sugar,
          brand,
          servingSize,
          servings,
          userId: req.user.id
        });
        if (!newItem) res.sendStatus(404);
        else res.json(newItem);
      }
    }
  } catch (error) {
    console.log("route", error);
    next(error);
  }
});