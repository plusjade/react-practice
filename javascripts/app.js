var Gateway = React.createClass({
    displayName: 'Gateway'
    ,
    getInitialState : function() {
        return { user: {}, active: 0 }
    }
    ,
    getDefaultProps : function() {
        return { user: {} }
    }
    ,
    render: function() {
        var page;
        if(this.state.doesUserExist) {
            page = Complete({ reason: 'exist' });
        }
        else if(this.state.user.email) {
            if(this.state.start) {
                if(this.state.seconds === 0) {
                    page = Complete({ reason: 'time' });
                }
                else if(this.state.active > (this.props.questions.length-1)) {
                    page = Complete({ reason: 'complete' });
                }
                else {
                    page = Quiz({
                                questions : this.props.questions,
                                active: this.state.active,
                                seconds: this.state.seconds,
                                user: this.state.user,
                                selected: this.state.selected,
                                errors: this.state.errors,
                                update: this.update
                            });
                }
            }
            else {
                page = Intstructions({
                            user: this.state.user,
                            update: this.update
                        });
            }
        }
        else {
            page = Splash({ update: this.update, emailValid: this.state.emailValid });
        }

        return page;
    }
    ,
    update : function(data) {
        this.setState(data);
    }
});
Gateway = React.createFactory(Gateway);


var Splash = React.createClass({
    displayName: 'Splash'
    ,
    getDefaultProps : function() {
        return { }
    }
    ,
    render: function() {
        return React.DOM.div({ id: 'splash-wrap' }
                    , React.DOM.h1(null
                        , "The Instacart Shopper's Challenge"
                    )
                    , React.DOM.div(null
                        , React.DOM.form({ onSubmit: this.submit }
                            , React.DOM.h2(null, 'Enter Email')
                            , React.DOM.input({ placeholder: 'name@email.com', ref: 'email', onChange: this.valid })
                            , React.DOM.button({
                                    type: 'submit',
                                    disabled: this.props.emailValid ? null : true,
                                    className: this.props.emailValid ? null : 'disabled'
                                }
                                , 'Submit'
                            )
                        )
                    )
                )
        ;
    }
    ,
    valid : function(event) {
        this.props.update({ emailValid : !!event.target.value })
    }
    ,
    submit : function(event) {
        event.preventDefault();
        var email = this.refs.email.getDOMNode().value;
        if(email) { // todo verify the email
            this.props.update({ user: { email: email }})
        }
    }
});
Splash = React.createFactory(Splash);



var Intstructions = React.createClass({
    displayName: 'Intstructions'
    ,
    getDefaultProps : function() {
        return { }
    }
    ,
    render: function() {
        return React.DOM.div({ id: 'instructions-wrap' }
                    , React.DOM.h1(null
                        , "Hello " + this.props.user.email + " =)"
                    )
                    , React.DOM.p(null
                        , "Thanks for taking the time to do our shopping challenge."
                    )
                    , React.DOM.h2(null
                        , "Instructions"
                    )
                    , React.DOM.ul(null
                        , React.DOM.li(null, "You will be presented with a product description and four images.")
                        , React.DOM.li(null, "Select the image that best matches the description then press submit.")
                        , React.DOM.li(null, 'You have 2 minutes to complete as many questions as you can.')
                        , React.DOM.li(null, 'The timer will start as soong as you press the button below.')
                        , React.DOM.li(null, "You only get one try, so make sure you are ready.")
                        , React.DOM.li(null, "Good luck and have fun!")
                        
                        
                    )
                    , React.DOM.button({ type: 'submit', onClick: this.start }, 'Start the Challenge!')
                )
        ;
    }
    ,
    start : function(event) {
        event.preventDefault();
        this.props.update({ start: true });
    }
});
Intstructions = React.createFactory(Intstructions);


var Timer = React.createClass({
    displayName: 'Timer'
    ,
    setInterval: function() {
      this.interval = setInterval.apply(null, arguments);
    }
    ,
    componentDidMount: function() {
        this.setInterval(this.tick, 1000);
    }
    ,
    componentWillUnmount : function() {
        clearInterval(this.interval)
    }
    ,
    getDefaultProps : function() {
        return { seconds: 120 }
    }
    ,
    render: function() {

        return React.DOM.div({ className: 'timer ' + ((this.props.seconds <= 15) ? 'low' : null) }
                    , this.props.seconds
                    , ' seconds left'
                )
        ;
    }
    ,
    tick: function() {
        if(this.props.seconds > 0) {
            this.props.update({ seconds: this.props.seconds - 1 });
        }
     },
});
Timer = React.createFactory(Timer);


var Quiz = React.createClass({
    displayName: 'Quiz'
    ,
    getDefaultProps : function() {
        return { questions : [], active: 0 }
    }
    ,
    render: function() {
        var question = this.props.questions[this.props.active];

        return React.DOM.div({ id: 'quiz-wrap' }
                    , Timer(
                        {
                            seconds: this.props.seconds,
                            update: this.props.update
                        }
                    )
                    , Question(_.extend({ key: this.props.active }, this.props, question))
                    , React.DOM.div({ className: 'question-count' }
                        , (this.props.active+1) + ' of ' + this.props.questions.length
                    )
                )
        ;
    }
    ,
    start : function(event) {
        event.preventDefault();
        this.props.update({ start: true });
    }
});
Quiz = React.createFactory(Quiz);



var Question = React.createClass({
    displayName: 'Question'
    ,
    componentDidMount : function() {
        window.scrollTo(0, 0);
        this.refs['choice-0'].getDOMNode().focus();
    }
    ,
    getDefaultProps : function() {
        return { question: null, answers: [] }
    }
    ,
    render: function() {
        var answers;
        answers = this.props.answers.map(function(a, i) {
            return React.DOM.input({
                            onChange: this.select.bind(this, i),
                            type: 'radio',
                            name: 'choice',
                            id: 'choice-' + i,
                            ref: 'choice-' + i,
                            value : a
                        }
                        , React.DOM.label({ htmlFor: 'choice-' + i }
                            , React.DOM.img({ src: a, className: this.props.selected === ('choice-' + i) ? 'active' : null })
                        )
                    )

        }, this);

        return React.DOM.div({ className: 'question-wrap' }
                    , React.DOM.h1(null
                        , this.props.question
                    )
                    , React.DOM.form({ onSubmit: this.submit }
                        , answers
                        , React.DOM.div({ className: 'button-wrap' }
                            , React.DOM.h4(null
                                , 'Click or press an image to make your selection.'
                            )
                            , React.DOM.button({
                                    type: 'submit',
                                    disabled: this.props.selected ? null : true,
                                    className: this.props.selected ? null : 'disabled'
                                }
                                , 'Submit'
                            )
                        )
                    )
                )
        ;
    }
    ,
    select : function(i) {
        this.props.update({ selected: 'choice-' + i });
    }
    ,
    submit : function(event) {
        event.preventDefault();
        var value, r;
        for(r in this.refs) {
            if(this.refs[r].getDOMNode().checked) {
                value = this.refs[r].getDOMNode().value
            }
        }
        if(value) {
            var q = {};
            q[this.props.question] = value;
            console.log(q);

            this.props.update({
                active: (this.props.active+1),
                selected: false
            });
        }
        else {
            this.props.update({ errors: { emptyQuestion : true } });
        }
    }

});
Question = React.createFactory(Question);


var Complete = React.createClass({
    displayName: 'Complete'
    ,
    render: function() {
        var message;
        switch(this.props.reason) {
            case 'time':
                message = 'Time is up!';
                break;
            case 'complete':
                message = "You're finished!";
                break;
            case 'exist':
                message = "You've already taken the Challenge!";
                break;
        }

        return React.DOM.div({ id: 'complete-wrap' }
                    , React.DOM.h1(null, message)
                    , React.DOM.h1(null
                        , 'Great Job, thank You!'
                    )
                    , React.DOM.p(null
                        , "We have saved your results and will be in touch with you shortly."
                    )
                )
        ;
    }
});
Complete = React.createFactory(Complete);
