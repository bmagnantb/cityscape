"use strict";

var React = require("react");
var RouteHandlerMixin = require("../RouteHandlerMixin");

/**
 * A <RouteHandler> component renders the active child route handler
 * when routes are nested.
 */
var RouteHandler = React.createClass({

  displayName: "RouteHandler",

  mixins: [RouteHandlerMixin],

  render: function render() {
    // IMPORTANT: This span "soaks" up owner context, keeping
    // React 0.13.0 from throwing a warning.
    // TODO: Why should this even be necessary?
    return <span>{ this.createChildRouteHandler() }</span>
  }

});

module.exports = RouteHandler;