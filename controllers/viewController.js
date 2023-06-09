const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Booking = require('../models/bookingModel');

exports.alerts = (req, res, next) => {
    const { alert } = req.query;
    if(alert === "booking"){
        res.locals.alert = "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediately, please come back later.";
    }
    next();
}

exports.getOverview = catchAsync( async(req, res, next)=>{
    //Get all the tours from the database
    const tours = await Tour.find();

    //then create a template 
    //pass tours to template
    res.status(200).render('overview', {
        title: "All tours",
        tours
    });
});

exports.getTour = catchAsync(async (req, res, next)=>{
    //Get the requested tour with (reviews and guides)
    const tour = await Tour.findOne({slug: req.params.slug}).populate({
        path: 'reviews',
        fields: 'rating review users'
    });

    if(!tour){
        return next(new AppError('There is no tour with that name', 404));
    }
    res.status(200).render('tour', {
        title: `${tour.name} tour`,
        tour
    });
});

exports.getLoginForm = (req, res)=>{
    res.status(200).render('login',{
        title: 'login to your account'
    });
}

exports.getSignUpForm = (req, res) => {
    res.status(200).render('signup', {
        title: 'Sign up'
    });
}

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'Your account'
    });
}

exports.getMyTour = catchAsync( async(req, res, next) => {
    //Find all the bookings
    const bookings = await Booking.find({ user: req.user.id });

    //Find tours with the returned Id
    const tourIds = bookings.map( el => el.tour );

    const tours = await Tour.find({ _id: { $in: tourIds }});

    res.status(200).render('overview', {
        title: 'My tours',
        tours
    });
});