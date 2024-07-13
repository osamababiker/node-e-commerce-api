// const notFound = (req, res) => res.status(404).send('Route does not exist')

// module.exports = notFound

const notFound = (req, res) => {
    res.status(404).send('Route does not exist');
};

export default notFound;
