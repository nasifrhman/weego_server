const favouriteModel = require("./favourite.model");

const addFavouriteService = async (data) => {
    return await favouriteModel.create(data);
}


const unFavouriteService = async (data) => {
    return await favouriteModel.deleteOne(data)
}

module.exports = {
    addFavouriteService,
    unFavouriteService
}