class apiFeatures{
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    filter(){
        let queryObj = {...this.queryString};
        const excludedEl = ['page', 'limit', 'sort', 'fields'];
        excludedEl.forEach((el)=> delete queryObj[el]);
        
        queryObj = JSON.stringify(queryObj).replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`);
        this.query = this.query.find(JSON.parse(queryObj));
        return this;
    }

    sort(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }
        else{
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    paginate(){
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit *1 || 1;
        const skip = (page-1)*limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }

    limitFields(){
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }
        else{
            this.query = this.query.select('-__v');
        }
        return this;
    }
}

module.exports = apiFeatures;