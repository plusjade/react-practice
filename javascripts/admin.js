var Admin = React.createClass({
    displayName: 'Admin'
    ,
    getDefaultProps : function() {
        return { users: [] }
    }
    ,
    getInitialState : function() {
        return {}
    }
    ,
    render: function() {
        var q, users, usersList, total = 0, report;
        users = this.props.users;
        users.sort(function(a, b) {
            return b.correct > a.correct ? 1 : -1;
        })
        for (q in this.props.lookup) {
            total++;
        }

        usersList = users.map(function(d) {
                    var percent = ((d.correct/total)*100);
                    if((percent+'').length !== 3) {
                        percent = percent.toPrecision(2);
                    }
                    return React.DOM.li({
                                onClick: this.setActive.bind(this, d.email),
                                className: this.state.email === d.email ? 'active' : null
                            }
                            , React.DOM.span(null, d.email)
                            , React.DOM.span({ className: 'summary' }
                                , React.DOM.span(null, d.correct + '/' + total)
                                , React.DOM.span(null, percent + '%')
                            )
                        )
                    ;
                }, this);

        usersList = React.DOM.ol(null, usersList);

        if(this.state.email) {
            report = UserReport({
                        key: this.state.email,
                        email : this.state.email,
                        lookup: this.props.lookup,
                        answers : this.state.answers,
                        update: this.update
                    })
        }

        return React.DOM.div({ id: 'admin-wrap', className: 'wrap' }
                    , React.DOM.h1(null, 'Admin')
                    , React.DOM.div({ className: 'users'}, usersList)
                    , React.DOM.div({ className: 'report'}, report)
                )
        ;
    }
    ,
    setActive : function(email) {
        this.setState({ email: email })
    }
    ,
    update : function(data) {
        this.setState(data);
    }
});
Admin = React.createFactory(Admin);


var UserReport = React.createClass({
    displayName: 'UserReport'
    ,
    componentWillMount : function() {
        var update = this.props.update;
        DB.userAnswers(this.props.email, function(data) {
            update({ answers : data });
        })
    }
    ,
    getDefaultProps : function() {
        return { answers: {} }
    }
    ,
    render: function() {
        console.log(this.props);
        var entries = [], q;

        for (q in this.props.lookup) {
            entries.push(
                React.DOM.li({
                        className: this.props.answers[q] === this.props.lookup[q]
                                        ? 'valid'
                                        : 'error'
                    }
                    , React.DOM.span(null, q)
                )
            );
        }

        return React.DOM.ol(null, entries);
    }
});
UserReport = React.createFactory(UserReport);
