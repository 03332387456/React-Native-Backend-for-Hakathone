const { SendResponse } = require("../helpers/helpers");
const courseModel = require("./coursemodel")
// const courseModel = require("./controllers/courseModel")


const CourseController = {

    // // // =======add Api=======

    add: async (req, res) => {
        try {
            let { name, shortName, fee } = req.body;
            let obj = { name, shortName, fee };

            let errArr = [];

            if (!obj.name) {
                errArr.push("Required Name");
            }
            if (!obj.shortName) {
                errArr.push("Required Short Name");
            }

            if (errArr.length > 0) {
                res.status(400).send(SendResponse(false, "Validation Error !", errArr));
            } else {
                let course = new courseModel(obj)
                let result = await course.save()
                res.status(200).send(
                    SendResponse(true, 'data Added Successfully', result))
            }
        } catch (error) {
            res.status(500).send(
                SendResponse(false, 'internal server error', error))
        }
    },

    // // // =======get Api=======

    get: async (req, res) => {
        try {
            const result = await courseModel.find();
            console.log("Result from get endpoint:", result); // Add this line
            res.status(200).send(SendResponse(true, "", result));
        } catch (error) {
            res.status(500).send(SendResponse(false, "internal server error", error));
        }
    },


    // // // =======getByID Api=======


    getById: async (req, res) => {
        try {
            let id = req.params.id;
            let result = await courseModel.findById(id)
            res.status(200).send(SendResponse(true, "", result))
        } catch (error) {
            res.status(500).send(SendResponse(false, "internal server Error", error))
        }
    },

    // // // =======Delete Api=======

    del: (async (req, res) => {
        try {
            const id = req.params.id;
            const result = await courseModel.findByIdAndDelete(id);
            if (result) {
                res.status(200).send(SendResponse(true, "record deleted Sucessfully", result))
            } else {
                res.status(404).send(SendResponse(false, "record not found"))
            }
        } catch (error) {
            res.status(500).send(SendResponse(false, "internal server error", error))
        }
    }),



    delAll: (async (req, res) => {
        try {
            const result = await courseModel.deleteMany({});
            if (result) {
                res.status(200).send(SendResponse(true, "record deleted Sucessfully", result))
            } else {
                res.status(404).send(SendResponse(false, "record not found"))
            }
        } catch (error) {
            res.status(500).send(SendResponse(false, "internal server error", error))
        }
    }),


    edit: (async (req, res) => {
        try {
            const id = req.params.id;
            const updateData = req.body;

            const result = await courseModel.findByIdAndUpdate(id, updateData, { new: true });

            if (result) {
                res.status(200).send(SendResponse(true, "Record updated successfully", result));
            } else {
                res.status(404).send(SendResponse(false, "Record not found"));
            }
        } catch (error) {
            res.status(500).send(SendResponse(false, "Internal server error", error));
        }
    })

};

module.exports = CourseController;