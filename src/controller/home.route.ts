import express from 'express';
import controller from "../controller/IndexController";

const router = express.Router();


router.get('/', async (req: express.Request, res: express.Response) => {
    let topProducts = await controller.getTopProduct();
    //console.log(topProducts);
    let bestViewCourse = await controller.getBestViewCourse();
    //console.log(bestViewCourse);

    let highlightCourse = await controller.getHighlightCourse();
    //console.log(highlightCourse);

    let highlightCategories = await controller.getHighlightCategories();
    //console.log(highlightCategories);

    //console.log(highlightCategories);
    res.render("index", {
        topProducts: topProducts,
        bestViewCourse: bestViewCourse,
        highlightCourse: highlightCourse,
        highlightCategories: highlightCategories
    })
});

export default router;