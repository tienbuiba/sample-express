

export const sortMiddleware = (req, res, next) => {

    res.locals._sort = {
        enabled: false,
        type: 'default'
    }

    if (req.query.hasOwnProperty('_sort')) {
        // res.locals._sort.enabled = true;
        // res.locals._sort.type = req.query.type;

        Object.assign(res.locals._sort, {
            enabled: true,
            type: req.query.type
        })
    }

    next()

}