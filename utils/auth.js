//helper to redierect unauthenticted users attemped to bypass login
const withAuth = (req, res, next) => {
    if(!req.session.user_id){
        res.redirect('/login');
    } else {
        next();
    }
};

module.exports = withAuth;