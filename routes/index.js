var helmet = require('helmet');

exports.index = function (req, res) {
    res.render('index');
};

exports.getPolicy = function (req, res) {
    // Remove CSP headers for policy management page so we can't break ourselves
    res.removeHeader("X-WebKit-CSP");
    res.removeHeader("Content-Security-Policy");
    res.removeHeader("x-content-security-policy");
    
    res.render('policy', { 
        policy: JSON.stringify(helmet.csp.toJS(), null, 4),
    });
};
