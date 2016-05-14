System.config({
  defaultJSExtensions: true,
  transpiler: false,
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*",
    "*.config.js": "public/*.config.js",
    "system.config.js": "system.config.js",
    "addons/*": "public/addons/*",
    "assets/*": "public/assets/*",
    "domains/*": "public/domains/*",
    "metrics/*": "public/metrics/*"
  },
  bundles: {
    "bundles/vendor.js": [
      "npm:react-wildcat-prefetch@4.0.0.js",
      "npm:react-wildcat-prefetch@4.0.0/index.js",
      "npm:hoist-non-react-statics@1.0.6.js",
      "npm:hoist-non-react-statics@1.0.6/index.js",
      "npm:invariant@2.2.1.js",
      "npm:invariant@2.2.1/browser.js",
      "github:jspm/nodelibs-process@0.1.2.js",
      "github:jspm/nodelibs-process@0.1.2/index.js",
      "npm:process@0.11.3.js",
      "npm:process@0.11.3/browser.js",
      "npm:exenv@1.2.1.js",
      "npm:exenv@1.2.1/index.js",
      "npm:react@15.0.2.js",
      "npm:react@15.0.2/react.js",
      "npm:react@15.0.2/lib/React.js",
      "npm:fbjs@0.8.2/lib/warning.js",
      "npm:fbjs@0.8.2/lib/emptyFunction.js",
      "npm:react@15.0.2/lib/onlyChild.js",
      "npm:fbjs@0.8.2/lib/invariant.js",
      "npm:react@15.0.2/lib/ReactElement.js",
      "npm:react@15.0.2/lib/canDefineProperty.js",
      "npm:react@15.0.2/lib/ReactCurrentOwner.js",
      "npm:object-assign@4.1.0.js",
      "npm:object-assign@4.1.0/index.js",
      "npm:react@15.0.2/lib/ReactVersion.js",
      "npm:react@15.0.2/lib/ReactPropTypes.js",
      "npm:react@15.0.2/lib/getIteratorFn.js",
      "npm:react@15.0.2/lib/ReactPropTypeLocationNames.js",
      "npm:react@15.0.2/lib/ReactElementValidator.js",
      "npm:react@15.0.2/lib/ReactPropTypeLocations.js",
      "npm:fbjs@0.8.2/lib/keyMirror.js",
      "npm:react@15.0.2/lib/ReactDOMFactories.js",
      "npm:fbjs@0.8.2/lib/mapObject.js",
      "npm:react@15.0.2/lib/ReactClass.js",
      "npm:fbjs@0.8.2/lib/keyOf.js",
      "npm:fbjs@0.8.2/lib/emptyObject.js",
      "npm:react@15.0.2/lib/ReactNoopUpdateQueue.js",
      "npm:react@15.0.2/lib/ReactComponent.js",
      "npm:react@15.0.2/lib/ReactInstrumentation.js",
      "npm:react@15.0.2/lib/ReactDebugTool.js",
      "npm:react@15.0.2/lib/ReactInvalidSetStateWarningDevTool.js",
      "npm:react@15.0.2/lib/ReactChildren.js",
      "npm:react@15.0.2/lib/traverseAllChildren.js",
      "npm:react@15.0.2/lib/KeyEscapeUtils.js",
      "npm:react@15.0.2/lib/PooledClass.js",
      "npm:react-wildcat-handoff@4.0.0/client.js",
      "npm:react-router@2.4.0.js",
      "npm:react-router@2.4.0/lib/index.js",
      "npm:react-router@2.4.0/lib/createMemoryHistory.js",
      "npm:history@2.1.1/lib/createMemoryHistory.js",
      "npm:history@2.1.1/lib/createHistory.js",
      "npm:history@2.1.1/lib/deprecate.js",
      "npm:warning@2.1.0.js",
      "npm:warning@2.1.0/browser.js",
      "npm:history@2.1.1/lib/runTransitionHook.js",
      "npm:history@2.1.1/lib/createLocation.js",
      "npm:history@2.1.1/lib/PathUtils.js",
      "npm:history@2.1.1/lib/Actions.js",
      "npm:history@2.1.1/lib/AsyncUtils.js",
      "npm:deep-equal@1.0.1.js",
      "npm:deep-equal@1.0.1/index.js",
      "npm:deep-equal@1.0.1/lib/is_arguments.js",
      "npm:deep-equal@1.0.1/lib/keys.js",
      "npm:history@2.1.1/lib/useBasename.js",
      "npm:history@2.1.1/lib/ExecutionEnvironment.js",
      "npm:history@2.1.1/lib/useQueries.js",
      "npm:query-string@3.0.3.js",
      "npm:query-string@3.0.3/index.js",
      "npm:strict-uri-encode@1.1.0.js",
      "npm:strict-uri-encode@1.1.0/index.js",
      "npm:react-router@2.4.0/lib/hashHistory.js",
      "npm:react-router@2.4.0/lib/createRouterHistory.js",
      "npm:react-router@2.4.0/lib/useRouterHistory.js",
      "npm:history@2.1.1/lib/createHashHistory.js",
      "npm:history@2.1.1/lib/createDOMHistory.js",
      "npm:history@2.1.1/lib/DOMUtils.js",
      "npm:history@2.1.1/lib/DOMStateStorage.js",
      "npm:react-router@2.4.0/lib/browserHistory.js",
      "npm:history@2.1.1/lib/createBrowserHistory.js",
      "npm:react-router@2.4.0/lib/applyRouterMiddleware.js",
      "npm:react-router@2.4.0/lib/RouterContext.js",
      "npm:react-router@2.4.0/lib/routerWarning.js",
      "npm:react-router@2.4.0/lib/RouteUtils.js",
      "npm:react-router@2.4.0/lib/getRouteParams.js",
      "npm:react-router@2.4.0/lib/PatternUtils.js",
      "npm:react-router@2.4.0/lib/deprecateObjectProperties.js",
      "npm:react-router@2.4.0/lib/match.js",
      "npm:react-router@2.4.0/lib/RouterUtils.js",
      "npm:react-router@2.4.0/lib/createTransitionManager.js",
      "npm:react-router@2.4.0/lib/matchRoutes.js",
      "npm:react-router@2.4.0/lib/AsyncUtils.js",
      "npm:react-router@2.4.0/lib/getComponents.js",
      "npm:react-router@2.4.0/lib/isActive.js",
      "npm:react-router@2.4.0/lib/TransitionUtils.js",
      "npm:react-router@2.4.0/lib/computeChangedRoutes.js",
      "npm:react-router@2.4.0/lib/RoutingContext.js",
      "npm:react-router@2.4.0/lib/useRoutes.js",
      "npm:react-router@2.4.0/lib/RouteContext.js",
      "npm:react-router@2.4.0/lib/Lifecycle.js",
      "npm:react-router@2.4.0/lib/History.js",
      "npm:react-router@2.4.0/lib/InternalPropTypes.js",
      "npm:react-router@2.4.0/lib/Route.js",
      "npm:react-router@2.4.0/lib/Redirect.js",
      "npm:react-router@2.4.0/lib/IndexRoute.js",
      "npm:react-router@2.4.0/lib/IndexRedirect.js",
      "npm:react-router@2.4.0/lib/withRouter.js",
      "npm:react-router@2.4.0/lib/PropTypes.js",
      "npm:react-router@2.4.0/lib/IndexLink.js",
      "npm:react-router@2.4.0/lib/Link.js",
      "npm:react-router@2.4.0/lib/Router.js",
      "npm:history@2.1.1.js",
      "npm:history@2.1.1/lib/index.js",
      "npm:history@2.1.1/lib/enableQueries.js",
      "npm:history@2.1.1/lib/enableBeforeUnload.js",
      "npm:history@2.1.1/lib/useBeforeUnload.js",
      "npm:react-wildcat-handoff@4.0.0/utils/getDomainRoutes.js",
      "npm:parse-domain@0.2.1.js",
      "npm:parse-domain@0.2.1/lib/parseDomain.js",
      "npm:parse-domain@0.2.1/lib/tld.js",
      "npm:react-wildcat-handoff@4.0.0/utils/clientRender.js",
      "npm:react-wildcat-handoff@4.0.0/utils/clientContext.js",
      "npm:react-dom@15.0.2.js",
      "npm:react-dom@15.0.2/index.js",
      "npm:react@15.0.2/lib/ReactDOM.js",
      "npm:fbjs@0.8.2/lib/ExecutionEnvironment.js",
      "npm:react@15.0.2/lib/renderSubtreeIntoContainer.js",
      "npm:react@15.0.2/lib/ReactMount.js",
      "npm:react@15.0.2/lib/shouldUpdateReactComponent.js",
      "npm:react@15.0.2/lib/setInnerHTML.js",
      "npm:react@15.0.2/lib/createMicrosoftUnsafeLocalFunction.js",
      "npm:react@15.0.2/lib/instantiateReactComponent.js",
      "npm:react@15.0.2/lib/ReactNativeComponent.js",
      "npm:react@15.0.2/lib/ReactEmptyComponent.js",
      "npm:react@15.0.2/lib/ReactCompositeComponent.js",
      "npm:react@15.0.2/lib/ReactUpdateQueue.js",
      "npm:react@15.0.2/lib/ReactUpdates.js",
      "npm:react@15.0.2/lib/Transaction.js",
      "npm:react@15.0.2/lib/ReactReconciler.js",
      "npm:react@15.0.2/lib/ReactRef.js",
      "npm:react@15.0.2/lib/ReactOwner.js",
      "npm:react@15.0.2/lib/ReactPerf.js",
      "npm:react@15.0.2/lib/ReactFeatureFlags.js",
      "npm:react@15.0.2/lib/CallbackQueue.js",
      "npm:react@15.0.2/lib/ReactInstanceMap.js",
      "npm:react@15.0.2/lib/ReactNodeTypes.js",
      "npm:react@15.0.2/lib/ReactErrorUtils.js",
      "npm:react@15.0.2/lib/ReactComponentEnvironment.js",
      "npm:react@15.0.2/lib/ReactMarkupChecksum.js",
      "npm:react@15.0.2/lib/adler32.js",
      "npm:react@15.0.2/lib/ReactDOMFeatureFlags.js",
      "npm:react@15.0.2/lib/ReactDOMContainerInfo.js",
      "npm:react@15.0.2/lib/validateDOMNesting.js",
      "npm:react@15.0.2/lib/ReactDOMComponentTree.js",
      "npm:react@15.0.2/lib/ReactDOMComponentFlags.js",
      "npm:react@15.0.2/lib/DOMProperty.js",
      "npm:react@15.0.2/lib/ReactBrowserEventEmitter.js",
      "npm:react@15.0.2/lib/isEventSupported.js",
      "npm:react@15.0.2/lib/getVendorPrefixedEventName.js",
      "npm:react@15.0.2/lib/ViewportMetrics.js",
      "npm:react@15.0.2/lib/ReactEventEmitterMixin.js",
      "npm:react@15.0.2/lib/EventPluginHub.js",
      "npm:react@15.0.2/lib/forEachAccumulated.js",
      "npm:react@15.0.2/lib/accumulateInto.js",
      "npm:react@15.0.2/lib/EventPluginUtils.js",
      "npm:react@15.0.2/lib/EventConstants.js",
      "npm:react@15.0.2/lib/EventPluginRegistry.js",
      "npm:react@15.0.2/lib/DOMLazyTree.js",
      "npm:react@15.0.2/lib/setTextContent.js",
      "npm:react@15.0.2/lib/escapeTextContentForBrowser.js",
      "npm:react@15.0.2/lib/getNativeComponentFromComposite.js",
      "npm:react@15.0.2/lib/findDOMNode.js",
      "npm:react@15.0.2/lib/ReactDefaultInjection.js",
      "npm:react@15.0.2/lib/ReactDefaultPerf.js",
      "npm:fbjs@0.8.2/lib/performanceNow.js",
      "npm:fbjs@0.8.2/lib/performance.js",
      "npm:react@15.0.2/lib/ReactDefaultPerfAnalysis.js",
      "npm:react@15.0.2/lib/SimpleEventPlugin.js",
      "npm:react@15.0.2/lib/getEventCharCode.js",
      "npm:react@15.0.2/lib/SyntheticWheelEvent.js",
      "npm:react@15.0.2/lib/SyntheticMouseEvent.js",
      "npm:react@15.0.2/lib/getEventModifierState.js",
      "npm:react@15.0.2/lib/SyntheticUIEvent.js",
      "npm:react@15.0.2/lib/getEventTarget.js",
      "npm:react@15.0.2/lib/SyntheticEvent.js",
      "npm:react@15.0.2/lib/SyntheticTransitionEvent.js",
      "npm:react@15.0.2/lib/SyntheticTouchEvent.js",
      "npm:react@15.0.2/lib/SyntheticDragEvent.js",
      "npm:react@15.0.2/lib/SyntheticKeyboardEvent.js",
      "npm:react@15.0.2/lib/getEventKey.js",
      "npm:react@15.0.2/lib/SyntheticFocusEvent.js",
      "npm:react@15.0.2/lib/SyntheticClipboardEvent.js",
      "npm:react@15.0.2/lib/SyntheticAnimationEvent.js",
      "npm:react@15.0.2/lib/EventPropagators.js",
      "npm:fbjs@0.8.2/lib/EventListener.js",
      "npm:react@15.0.2/lib/SelectEventPlugin.js",
      "npm:fbjs@0.8.2/lib/shallowEqual.js",
      "npm:react@15.0.2/lib/isTextInputElement.js",
      "npm:fbjs@0.8.2/lib/getActiveElement.js",
      "npm:react@15.0.2/lib/ReactInputSelection.js",
      "npm:fbjs@0.8.2/lib/focusNode.js",
      "npm:fbjs@0.8.2/lib/containsNode.js",
      "npm:fbjs@0.8.2/lib/isTextNode.js",
      "npm:fbjs@0.8.2/lib/isNode.js",
      "npm:react@15.0.2/lib/ReactDOMSelection.js",
      "npm:react@15.0.2/lib/getTextContentAccessor.js",
      "npm:react@15.0.2/lib/getNodeForCharacterOffset.js",
      "npm:react@15.0.2/lib/SVGDOMPropertyConfig.js",
      "npm:react@15.0.2/lib/ReactReconcileTransaction.js",
      "npm:react@15.0.2/lib/ReactInjection.js",
      "npm:react@15.0.2/lib/ReactEventListener.js",
      "npm:fbjs@0.8.2/lib/getUnboundedScrollPosition.js",
      "npm:react@15.0.2/lib/ReactDefaultBatchingStrategy.js",
      "npm:react@15.0.2/lib/ReactDOMTextComponent.js",
      "npm:react@15.0.2/lib/DOMChildrenOperations.js",
      "npm:react@15.0.2/lib/ReactMultiChildUpdateTypes.js",
      "npm:react@15.0.2/lib/Danger.js",
      "npm:fbjs@0.8.2/lib/getMarkupWrap.js",
      "npm:fbjs@0.8.2/lib/createNodesFromMarkup.js",
      "npm:fbjs@0.8.2/lib/createArrayFromMixed.js",
      "npm:react@15.0.2/lib/ReactDOMTreeTraversal.js",
      "npm:react@15.0.2/lib/ReactDOMEmptyComponent.js",
      "npm:react@15.0.2/lib/ReactDOMComponent.js",
      "npm:react@15.0.2/lib/ReactMultiChild.js",
      "npm:react@15.0.2/lib/flattenChildren.js",
      "npm:react@15.0.2/lib/ReactChildReconciler.js",
      "npm:react@15.0.2/lib/ReactDOMTextarea.js",
      "npm:react@15.0.2/lib/LinkedValueUtils.js",
      "npm:react@15.0.2/lib/DOMPropertyOperations.js",
      "npm:react@15.0.2/lib/quoteAttributeValueForBrowser.js",
      "npm:react@15.0.2/lib/ReactDOMInstrumentation.js",
      "npm:react@15.0.2/lib/ReactDOMDebugTool.js",
      "npm:react@15.0.2/lib/ReactDOMUnknownPropertyDevtool.js",
      "npm:react@15.0.2/lib/DisabledInputUtils.js",
      "npm:react@15.0.2/lib/ReactDOMSelect.js",
      "npm:react@15.0.2/lib/ReactDOMOption.js",
      "npm:react@15.0.2/lib/ReactDOMInput.js",
      "npm:react@15.0.2/lib/ReactDOMButton.js",
      "npm:react@15.0.2/lib/ReactComponentBrowserEnvironment.js",
      "npm:react@15.0.2/lib/ReactDOMIDOperations.js",
      "npm:react@15.0.2/lib/DOMNamespaces.js",
      "npm:react@15.0.2/lib/CSSPropertyOperations.js",
      "npm:fbjs@0.8.2/lib/memoizeStringOnly.js",
      "npm:fbjs@0.8.2/lib/hyphenateStyleName.js",
      "npm:fbjs@0.8.2/lib/hyphenate.js",
      "npm:react@15.0.2/lib/dangerousStyleValue.js",
      "npm:react@15.0.2/lib/CSSProperty.js",
      "npm:fbjs@0.8.2/lib/camelizeStyleName.js",
      "npm:fbjs@0.8.2/lib/camelize.js",
      "npm:react@15.0.2/lib/AutoFocusUtils.js",
      "npm:react@15.0.2/lib/HTMLDOMPropertyConfig.js",
      "npm:react@15.0.2/lib/EnterLeaveEventPlugin.js",
      "npm:react@15.0.2/lib/DefaultEventPluginOrder.js",
      "npm:react@15.0.2/lib/ChangeEventPlugin.js",
      "npm:react@15.0.2/lib/BeforeInputEventPlugin.js",
      "npm:react@15.0.2/lib/SyntheticInputEvent.js",
      "npm:react@15.0.2/lib/SyntheticCompositionEvent.js",
      "npm:react@15.0.2/lib/FallbackCompositionState.js",
      "npm:isomorphic-fetch@2.2.1.js",
      "npm:isomorphic-fetch@2.2.1/fetch-npm-browserify.js",
      "npm:whatwg-fetch@0.9.0.js",
      "npm:whatwg-fetch@0.9.0/fetch.js",
      "npm:react-wildcat-ensure@4.0.0.js",
      "npm:react-wildcat-ensure@4.0.0/dist/index.js",
      "npm:react-metrics@1.2.1.js",
      "npm:react-metrics@1.2.1/lib/index.js",
      "npm:react-metrics@1.2.1/lib/react/exposeMetrics.js",
      "npm:react-metrics@1.2.1/lib/react/PropTypes.js",
      "npm:react-metrics@1.2.1/lib/react/metrics.js",
      "npm:react-metrics@1.2.1/lib/react/findRouteComponent.js",
      "npm:react-metrics@1.2.1/lib/react/getRouteState.js",
      "npm:react-metrics@1.2.1/lib/react/isLocationValid.js",
      "npm:react-metrics@1.2.1/lib/react/locationEquals.js",
      "npm:react-metrics@1.2.1/lib/core/createMetrics.js",
      "npm:react-metrics@1.2.1/lib/core/useTrackBindingPlugin.js",
      "npm:react-metrics@1.2.1/lib/core/utils/attr2obj.js",
      "npm:fbjs@0.7.2/lib/EventListener.js",
      "npm:fbjs@0.7.2/lib/emptyFunction.js",
      "npm:react-metrics@1.2.1/lib/core/utils/isPromise.js",
      "npm:react-metrics@1.2.1/lib/core/utils/extractApis.js",
      "npm:react-metrics@1.2.1/lib/core/createService.js",
      "npm:react-metrics@1.2.1/lib/core/ActionTypes.js",
      "npm:fbjs@0.7.2/lib/warning.js",
      "npm:fbjs@0.7.2/lib/invariant.js",
      "npm:fbjs@0.7.2/lib/ExecutionEnvironment.js",
      "npm:querystring@0.2.0.js",
      "npm:querystring@0.2.0/index.js",
      "npm:querystring@0.2.0/encode.js",
      "npm:querystring@0.2.0/decode.js",
      "npm:eventemitter3@1.2.0.js",
      "npm:eventemitter3@1.2.0/index.js",
      "npm:react-metrics@1.2.1/lib/polyfill.js",
      "npm:core-js@2.4.0/fn/promise.js",
      "npm:core-js@2.4.0/modules/_core.js",
      "npm:core-js@2.4.0/modules/es6.promise.js",
      "npm:core-js@2.4.0/modules/_iter-detect.js",
      "npm:core-js@2.4.0/modules/_wks.js",
      "npm:core-js@2.4.0/modules/_global.js",
      "npm:core-js@2.4.0/modules/_uid.js",
      "npm:core-js@2.4.0/modules/_shared.js",
      "npm:core-js@2.4.0/modules/_set-species.js",
      "npm:core-js@2.4.0/modules/_descriptors.js",
      "npm:core-js@2.4.0/modules/_fails.js",
      "npm:core-js@2.4.0/modules/_object-dp.js",
      "npm:core-js@2.4.0/modules/_to-primitive.js",
      "npm:core-js@2.4.0/modules/_is-object.js",
      "npm:core-js@2.4.0/modules/_ie8-dom-define.js",
      "npm:core-js@2.4.0/modules/_dom-create.js",
      "npm:core-js@2.4.0/modules/_an-object.js",
      "npm:core-js@2.4.0/modules/_set-to-string-tag.js",
      "npm:core-js@2.4.0/modules/_has.js",
      "npm:core-js@2.4.0/modules/_redefine-all.js",
      "npm:core-js@2.4.0/modules/_redefine.js",
      "npm:core-js@2.4.0/modules/_hide.js",
      "npm:core-js@2.4.0/modules/_property-desc.js",
      "npm:core-js@2.4.0/modules/_microtask.js",
      "npm:core-js@2.4.0/modules/_cof.js",
      "npm:core-js@2.4.0/modules/_task.js",
      "npm:core-js@2.4.0/modules/_html.js",
      "npm:core-js@2.4.0/modules/_invoke.js",
      "npm:core-js@2.4.0/modules/_ctx.js",
      "npm:core-js@2.4.0/modules/_a-function.js",
      "npm:core-js@2.4.0/modules/_species-constructor.js",
      "npm:core-js@2.4.0/modules/_set-proto.js",
      "npm:core-js@2.4.0/modules/_object-gopd.js",
      "npm:core-js@2.4.0/modules/_to-iobject.js",
      "npm:core-js@2.4.0/modules/_defined.js",
      "npm:core-js@2.4.0/modules/_iobject.js",
      "npm:core-js@2.4.0/modules/_object-pie.js",
      "npm:core-js@2.4.0/modules/_for-of.js",
      "npm:core-js@2.4.0/modules/core.get-iterator-method.js",
      "npm:core-js@2.4.0/modules/_iterators.js",
      "npm:core-js@2.4.0/modules/_classof.js",
      "npm:core-js@2.4.0/modules/_to-length.js",
      "npm:core-js@2.4.0/modules/_to-integer.js",
      "npm:core-js@2.4.0/modules/_is-array-iter.js",
      "npm:core-js@2.4.0/modules/_iter-call.js",
      "npm:core-js@2.4.0/modules/_an-instance.js",
      "npm:core-js@2.4.0/modules/_export.js",
      "npm:core-js@2.4.0/modules/_library.js",
      "npm:core-js@2.4.0/modules/web.dom.iterable.js",
      "npm:core-js@2.4.0/modules/es6.array.iterator.js",
      "npm:core-js@2.4.0/modules/_iter-define.js",
      "npm:core-js@2.4.0/modules/_object-gpo.js",
      "npm:core-js@2.4.0/modules/_shared-key.js",
      "npm:core-js@2.4.0/modules/_to-object.js",
      "npm:core-js@2.4.0/modules/_iter-create.js",
      "npm:core-js@2.4.0/modules/_object-create.js",
      "npm:core-js@2.4.0/modules/_enum-bug-keys.js",
      "npm:core-js@2.4.0/modules/_object-dps.js",
      "npm:core-js@2.4.0/modules/_object-keys.js",
      "npm:core-js@2.4.0/modules/_object-keys-internal.js",
      "npm:core-js@2.4.0/modules/_array-includes.js",
      "npm:core-js@2.4.0/modules/_to-index.js",
      "npm:core-js@2.4.0/modules/_iter-step.js",
      "npm:core-js@2.4.0/modules/_add-to-unscopables.js",
      "npm:core-js@2.4.0/modules/es6.string.iterator.js",
      "npm:core-js@2.4.0/modules/_string-at.js",
      "npm:core-js@2.4.0/modules/es6.object.to-string.js",
      "npm:core-js@2.4.0/fn/object/assign.js",
      "npm:core-js@2.4.0/modules/es6.object.assign.js",
      "npm:core-js@2.4.0/modules/_object-assign.js",
      "npm:core-js@2.4.0/modules/_object-gops.js",
      "npm:core-js@2.4.0/fn/function/name.js",
      "npm:core-js@2.4.0/modules/es6.function.name.js",
      "npm:core-js@2.4.0/fn/array/from.js",
      "npm:core-js@2.4.0/modules/es6.array.from.js",
      "npm:core-js@2.4.0/modules/_create-property.js",
      "npm:react-helmet@3.1.0.js",
      "npm:react-helmet@3.1.0/lib/Helmet.js",
      "npm:react-helmet@3.1.0/lib/PlainComponent.js",
      "npm:react-helmet@3.1.0/lib/HelmetConstants.js",
      "npm:react-side-effect@1.0.2.js",
      "npm:react-side-effect@1.0.2/lib/index.js",
      "npm:fbjs@0.1.0-alpha.10/lib/shallowEqual.js",
      "npm:fbjs@0.1.0-alpha.10/lib/ExecutionEnvironment.js",
      "npm:radium@0.17.1.js",
      "npm:radium@0.17.1/dist/radium.js",
      "npm:babel-runtime@6.6.1/helpers/slicedToArray.js",
      "npm:babel-runtime@6.6.1/core-js/get-iterator.js",
      "npm:core-js@2.4.0/library/fn/get-iterator.js",
      "npm:core-js@2.4.0/library/modules/core.get-iterator.js",
      "npm:core-js@2.4.0/library/modules/_core.js",
      "npm:core-js@2.4.0/library/modules/core.get-iterator-method.js",
      "npm:core-js@2.4.0/library/modules/_iterators.js",
      "npm:core-js@2.4.0/library/modules/_wks.js",
      "npm:core-js@2.4.0/library/modules/_global.js",
      "npm:core-js@2.4.0/library/modules/_uid.js",
      "npm:core-js@2.4.0/library/modules/_shared.js",
      "npm:core-js@2.4.0/library/modules/_classof.js",
      "npm:core-js@2.4.0/library/modules/_cof.js",
      "npm:core-js@2.4.0/library/modules/_an-object.js",
      "npm:core-js@2.4.0/library/modules/_is-object.js",
      "npm:core-js@2.4.0/library/modules/es6.string.iterator.js",
      "npm:core-js@2.4.0/library/modules/_iter-define.js",
      "npm:core-js@2.4.0/library/modules/_object-gpo.js",
      "npm:core-js@2.4.0/library/modules/_shared-key.js",
      "npm:core-js@2.4.0/library/modules/_to-object.js",
      "npm:core-js@2.4.0/library/modules/_defined.js",
      "npm:core-js@2.4.0/library/modules/_has.js",
      "npm:core-js@2.4.0/library/modules/_set-to-string-tag.js",
      "npm:core-js@2.4.0/library/modules/_object-dp.js",
      "npm:core-js@2.4.0/library/modules/_descriptors.js",
      "npm:core-js@2.4.0/library/modules/_fails.js",
      "npm:core-js@2.4.0/library/modules/_to-primitive.js",
      "npm:core-js@2.4.0/library/modules/_ie8-dom-define.js",
      "npm:core-js@2.4.0/library/modules/_dom-create.js",
      "npm:core-js@2.4.0/library/modules/_iter-create.js",
      "npm:core-js@2.4.0/library/modules/_hide.js",
      "npm:core-js@2.4.0/library/modules/_property-desc.js",
      "npm:core-js@2.4.0/library/modules/_object-create.js",
      "npm:core-js@2.4.0/library/modules/_html.js",
      "npm:core-js@2.4.0/library/modules/_enum-bug-keys.js",
      "npm:core-js@2.4.0/library/modules/_object-dps.js",
      "npm:core-js@2.4.0/library/modules/_object-keys.js",
      "npm:core-js@2.4.0/library/modules/_object-keys-internal.js",
      "npm:core-js@2.4.0/library/modules/_array-includes.js",
      "npm:core-js@2.4.0/library/modules/_to-index.js",
      "npm:core-js@2.4.0/library/modules/_to-integer.js",
      "npm:core-js@2.4.0/library/modules/_to-length.js",
      "npm:core-js@2.4.0/library/modules/_to-iobject.js",
      "npm:core-js@2.4.0/library/modules/_iobject.js",
      "npm:core-js@2.4.0/library/modules/_redefine.js",
      "npm:core-js@2.4.0/library/modules/_export.js",
      "npm:core-js@2.4.0/library/modules/_ctx.js",
      "npm:core-js@2.4.0/library/modules/_a-function.js",
      "npm:core-js@2.4.0/library/modules/_library.js",
      "npm:core-js@2.4.0/library/modules/_string-at.js",
      "npm:core-js@2.4.0/library/modules/web.dom.iterable.js",
      "npm:core-js@2.4.0/library/modules/es6.array.iterator.js",
      "npm:core-js@2.4.0/library/modules/_iter-step.js",
      "npm:core-js@2.4.0/library/modules/_add-to-unscopables.js",
      "npm:babel-runtime@6.6.1/core-js/is-iterable.js",
      "npm:core-js@2.4.0/library/fn/is-iterable.js",
      "npm:core-js@2.4.0/library/modules/core.is-iterable.js",
      "npm:babel-runtime@6.6.1/helpers/possibleConstructorReturn.js",
      "npm:babel-runtime@6.6.1/helpers/typeof.js",
      "npm:babel-runtime@6.6.1/core-js/symbol.js",
      "npm:core-js@2.4.0/library/fn/symbol.js",
      "npm:core-js@2.4.0/library/fn/symbol/index.js",
      "npm:core-js@2.4.0/library/modules/es7.symbol.observable.js",
      "npm:core-js@2.4.0/library/modules/_wks-define.js",
      "npm:core-js@2.4.0/library/modules/_wks-ext.js",
      "npm:core-js@2.4.0/library/modules/es7.symbol.async-iterator.js",
      "npm:core-js@2.4.0/library/modules/es6.object.to-string.js",
      "npm:core-js@2.4.0/library/modules/es6.symbol.js",
      "npm:core-js@2.4.0/library/modules/_object-gops.js",
      "npm:core-js@2.4.0/library/modules/_object-pie.js",
      "npm:core-js@2.4.0/library/modules/_object-gopn.js",
      "npm:core-js@2.4.0/library/modules/_object-gopd.js",
      "npm:core-js@2.4.0/library/modules/_object-gopn-ext.js",
      "npm:core-js@2.4.0/library/modules/_is-array.js",
      "npm:core-js@2.4.0/library/modules/_enum-keys.js",
      "npm:core-js@2.4.0/library/modules/_keyof.js",
      "npm:core-js@2.4.0/library/modules/_meta.js",
      "npm:babel-runtime@6.6.1/core-js/symbol/iterator.js",
      "npm:core-js@2.4.0/library/fn/symbol/iterator.js",
      "npm:babel-runtime@6.6.1/helpers/inherits.js",
      "npm:babel-runtime@6.6.1/core-js/object/create.js",
      "npm:core-js@2.4.0/library/fn/object/create.js",
      "npm:core-js@2.4.0/library/modules/es6.object.create.js",
      "npm:babel-runtime@6.6.1/core-js/object/set-prototype-of.js",
      "npm:core-js@2.4.0/library/fn/object/set-prototype-of.js",
      "npm:core-js@2.4.0/library/modules/es6.object.set-prototype-of.js",
      "npm:core-js@2.4.0/library/modules/_set-proto.js",
      "npm:babel-runtime@6.6.1/helpers/extends.js",
      "npm:babel-runtime@6.6.1/core-js/object/assign.js",
      "npm:core-js@2.4.0/library/fn/object/assign.js",
      "npm:core-js@2.4.0/library/modules/es6.object.assign.js",
      "npm:core-js@2.4.0/library/modules/_object-assign.js",
      "npm:babel-runtime@6.6.1/helpers/defineProperty.js",
      "npm:babel-runtime@6.6.1/core-js/object/define-property.js",
      "npm:core-js@2.4.0/library/fn/object/define-property.js",
      "npm:core-js@2.4.0/library/modules/es6.object.define-property.js",
      "npm:babel-runtime@6.6.1/helpers/createClass.js",
      "npm:babel-runtime@6.6.1/helpers/classCallCheck.js",
      "npm:babel-runtime@6.6.1/core-js/object/get-prototype-of.js",
      "npm:core-js@2.4.0/library/fn/object/get-prototype-of.js",
      "npm:core-js@2.4.0/library/modules/es6.object.get-prototype-of.js",
      "npm:core-js@2.4.0/library/modules/_object-sap.js"
    ]
  },

  meta: {
    "bundles/*": {
      "format": "register"
    },
    "public/*": {
      "format": "cjs"
    },
    "*.eot.js": {
      "build": false
    },
    "*.gif.js": {
      "build": false
    },
    "*.jpeg.js": {
      "build": false
    },
    "*.jpg.js": {
      "build": false
    },
    "*.otf.js": {
      "build": false
    },
    "*.png.js": {
      "build": false
    },
    "*.svg.js": {
      "build": false
    },
    "*.ttf.js": {
      "build": false
    },
    "*.woff.js": {
      "build": false
    }
  },

  map: {
    "babel-runtime": "npm:babel-runtime@6.6.1",
    "core-js": "npm:core-js@2.4.0",
    "enzyme": "npm:enzyme@2.3.0",
    "exenv": "npm:exenv@1.2.1",
    "isomorphic-fetch": "npm:isomorphic-fetch@2.2.1",
    "radium": "npm:radium@0.17.1",
    "react": "npm:react@15.0.2",
    "react-addons-test-utils": "npm:react-addons-test-utils@15.0.2",
    "react-dom": "npm:react-dom@15.0.2",
    "react-helmet": "npm:react-helmet@3.1.0",
    "react-metrics": "npm:react-metrics@1.2.1",
    "react-router": "npm:react-router@2.4.0",
    "react-transform-catch-errors": "npm:react-transform-catch-errors@1.0.2",
    "react-transform-hmr": "npm:react-transform-hmr@1.0.4",
    "react-transform-jspm-hmr": "npm:react-transform-jspm-hmr@1.0.1",
    "react-wildcat-ensure": "npm:react-wildcat-ensure@4.0.0",
    "react-wildcat-handoff": "npm:react-wildcat-handoff@4.0.0",
    "react-wildcat-hot-reloader": "npm:react-wildcat-hot-reloader@4.0.0",
    "react-wildcat-prefetch": "npm:react-wildcat-prefetch@4.0.0",
    "redbox-react": "npm:redbox-react@1.2.4",
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.3.0"
    },
    "github:jspm/nodelibs-buffer@0.1.0": {
      "buffer": "npm:buffer@3.6.0"
    },
    "github:jspm/nodelibs-constants@0.1.0": {
      "constants-browserify": "npm:constants-browserify@0.0.1"
    },
    "github:jspm/nodelibs-crypto@0.1.0": {
      "crypto-browserify": "npm:crypto-browserify@3.11.0"
    },
    "github:jspm/nodelibs-domain@0.1.0": {
      "domain-browser": "npm:domain-browser@1.1.7"
    },
    "github:jspm/nodelibs-events@0.1.1": {
      "events": "npm:events@1.0.2"
    },
    "github:jspm/nodelibs-http@1.7.1": {
      "Base64": "npm:Base64@0.2.1",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "github:jspm/nodelibs-https@0.1.0": {
      "https-browserify": "npm:https-browserify@0.0.0"
    },
    "github:jspm/nodelibs-net@0.1.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "net": "github:jspm/nodelibs-net@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "timers": "github:jspm/nodelibs-timers@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.3"
    },
    "github:jspm/nodelibs-punycode@0.1.0": {
      "punycode": "npm:punycode@1.3.2"
    },
    "github:jspm/nodelibs-querystring@0.1.0": {
      "querystring": "npm:querystring@0.2.0"
    },
    "github:jspm/nodelibs-stream@0.1.0": {
      "stream-browserify": "npm:stream-browserify@1.0.0"
    },
    "github:jspm/nodelibs-string_decoder@0.1.0": {
      "string_decoder": "npm:string_decoder@0.10.31"
    },
    "github:jspm/nodelibs-timers@0.1.0": {
      "timers-browserify": "npm:timers-browserify@1.4.2"
    },
    "github:jspm/nodelibs-tty@0.1.0": {
      "tty-browserify": "npm:tty-browserify@0.0.0"
    },
    "github:jspm/nodelibs-url@0.1.0": {
      "url": "npm:url@0.10.3"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:jspm/nodelibs-vm@0.1.0": {
      "vm-browserify": "npm:vm-browserify@0.0.4"
    },
    "github:jspm/nodelibs-zlib@0.1.0": {
      "browserify-zlib": "npm:browserify-zlib@0.1.4"
    },
    "npm:acorn-globals@1.0.9": {
      "acorn": "npm:acorn@2.7.0"
    },
    "npm:acorn@2.7.0": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0"
    },
    "npm:amdefine@1.0.0": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "module": "github:jspm/nodelibs-module@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:asap@2.0.3": {
      "domain": "github:jspm/nodelibs-domain@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:asn1.js@4.6.0": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "bn.js": "npm:bn.js@4.11.3",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "inherits": "npm:inherits@2.0.1",
      "minimalistic-assert": "npm:minimalistic-assert@1.0.0",
      "vm": "github:jspm/nodelibs-vm@0.1.0"
    },
    "npm:asn1@0.2.3": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "sys": "github:jspm/nodelibs-util@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:assert-plus@0.2.0": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:assert-plus@1.0.0": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:assert@1.3.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:async@1.5.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:aws-sign2@0.6.0": {
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0"
    },
    "npm:aws4@1.4.1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "querystring": "github:jspm/nodelibs-querystring@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0"
    },
    "npm:babel-runtime@6.6.1": {
      "core-js": "npm:core-js@2.4.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:bl@1.1.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "readable-stream": "npm:readable-stream@2.0.6",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:bn.js@4.11.3": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:boom@2.10.1": {
      "hoek": "npm:hoek@2.16.3",
      "http": "github:jspm/nodelibs-http@1.7.1"
    },
    "npm:brace-expansion@1.1.4": {
      "balanced-match": "npm:balanced-match@0.4.1",
      "concat-map": "npm:concat-map@0.0.1"
    },
    "npm:browserify-aes@1.0.6": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "buffer-xor": "npm:buffer-xor@1.0.3",
      "cipher-base": "npm:cipher-base@1.0.2",
      "create-hash": "npm:create-hash@1.1.2",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "evp_bytestokey": "npm:evp_bytestokey@1.0.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "inherits": "npm:inherits@2.0.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:browserify-cipher@1.0.0": {
      "browserify-aes": "npm:browserify-aes@1.0.6",
      "browserify-des": "npm:browserify-des@1.0.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "evp_bytestokey": "npm:evp_bytestokey@1.0.0"
    },
    "npm:browserify-des@1.0.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "cipher-base": "npm:cipher-base@1.0.2",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "des.js": "npm:des.js@1.0.0",
      "inherits": "npm:inherits@2.0.1"
    },
    "npm:browserify-rsa@4.0.1": {
      "bn.js": "npm:bn.js@4.11.3",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "constants": "github:jspm/nodelibs-constants@0.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "randombytes": "npm:randombytes@2.0.3"
    },
    "npm:browserify-sign@4.0.0": {
      "bn.js": "npm:bn.js@4.11.3",
      "browserify-rsa": "npm:browserify-rsa@4.0.1",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "create-hash": "npm:create-hash@1.1.2",
      "create-hmac": "npm:create-hmac@1.1.4",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "elliptic": "npm:elliptic@6.2.3",
      "inherits": "npm:inherits@2.0.1",
      "parse-asn1": "npm:parse-asn1@5.0.0",
      "stream": "github:jspm/nodelibs-stream@0.1.0"
    },
    "npm:browserify-zlib@0.1.4": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "pako": "npm:pako@0.2.8",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "readable-stream": "npm:readable-stream@2.0.6",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:buffer-xor@1.0.3": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:buffer@3.6.0": {
      "base64-js": "npm:base64-js@0.0.8",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "ieee754": "npm:ieee754@1.1.6",
      "isarray": "npm:isarray@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:chalk@1.1.3": {
      "ansi-styles": "npm:ansi-styles@2.2.1",
      "escape-string-regexp": "npm:escape-string-regexp@1.0.5",
      "has-ansi": "npm:has-ansi@2.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "strip-ansi": "npm:strip-ansi@3.0.1",
      "supports-color": "npm:supports-color@2.0.0"
    },
    "npm:cheerio@0.20.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "css-select": "npm:css-select@1.2.0",
      "dom-serializer": "npm:dom-serializer@0.1.0",
      "entities": "npm:entities@1.1.1",
      "htmlparser2": "npm:htmlparser2@3.8.3",
      "jsdom": "npm:jsdom@7.2.2",
      "lodash": "npm:lodash@4.12.0",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:cipher-base@1.0.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "inherits": "npm:inherits@2.0.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "string_decoder": "github:jspm/nodelibs-string_decoder@0.1.0"
    },
    "npm:combined-stream@1.0.5": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "delayed-stream": "npm:delayed-stream@1.0.0",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:commander@2.9.0": {
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "graceful-readlink": "npm:graceful-readlink@1.0.1",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:constants-browserify@0.0.1": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:core-js@1.2.6": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:core-js@2.4.0": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:core-util-is@1.0.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:create-ecdh@4.0.0": {
      "bn.js": "npm:bn.js@4.11.3",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "elliptic": "npm:elliptic@6.2.3"
    },
    "npm:create-hash@1.1.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "cipher-base": "npm:cipher-base@1.0.2",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "inherits": "npm:inherits@2.0.1",
      "ripemd160": "npm:ripemd160@1.0.1",
      "sha.js": "npm:sha.js@2.4.5"
    },
    "npm:create-hmac@1.1.4": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "create-hash": "npm:create-hash@1.1.2",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "inherits": "npm:inherits@2.0.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0"
    },
    "npm:cryptiles@2.0.5": {
      "boom": "npm:boom@2.10.1",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0"
    },
    "npm:crypto-browserify@3.11.0": {
      "browserify-cipher": "npm:browserify-cipher@1.0.0",
      "browserify-sign": "npm:browserify-sign@4.0.0",
      "create-ecdh": "npm:create-ecdh@4.0.0",
      "create-hash": "npm:create-hash@1.1.2",
      "create-hmac": "npm:create-hmac@1.1.4",
      "diffie-hellman": "npm:diffie-hellman@5.0.2",
      "inherits": "npm:inherits@2.0.1",
      "pbkdf2": "npm:pbkdf2@3.0.4",
      "public-encrypt": "npm:public-encrypt@4.0.0",
      "randombytes": "npm:randombytes@2.0.3"
    },
    "npm:css-select@1.2.0": {
      "boolbase": "npm:boolbase@1.0.0",
      "css-what": "npm:css-what@2.1.0",
      "domutils": "npm:domutils@1.5.1",
      "nth-check": "npm:nth-check@1.0.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:cssstyle@0.2.34": {
      "cssom": "npm:cssom@0.3.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0"
    },
    "npm:dashdash@1.13.1": {
      "assert-plus": "npm:assert-plus@1.0.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:debug@2.2.0": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "ms": "npm:ms@0.7.1",
      "net": "github:jspm/nodelibs-net@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "tty": "github:jspm/nodelibs-tty@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:define-properties@1.1.2": {
      "foreach": "npm:foreach@2.0.5",
      "object-keys": "npm:object-keys@1.0.9"
    },
    "npm:delayed-stream@1.0.0": {
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:des.js@1.0.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "inherits": "npm:inherits@2.0.1",
      "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
    },
    "npm:diffie-hellman@5.0.2": {
      "bn.js": "npm:bn.js@4.11.3",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "miller-rabin": "npm:miller-rabin@4.0.0",
      "randombytes": "npm:randombytes@2.0.3",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:dom-serializer@0.1.0": {
      "domelementtype": "npm:domelementtype@1.1.3",
      "entities": "npm:entities@1.1.1"
    },
    "npm:domain-browser@1.1.7": {
      "events": "github:jspm/nodelibs-events@0.1.1"
    },
    "npm:domhandler@2.3.0": {
      "domelementtype": "npm:domelementtype@1.1.3"
    },
    "npm:domutils@1.5.1": {
      "dom-serializer": "npm:dom-serializer@0.1.0",
      "domelementtype": "npm:domelementtype@1.1.3"
    },
    "npm:ecc-jsbn@0.1.1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "jsbn": "npm:jsbn@0.1.0"
    },
    "npm:elliptic@6.2.3": {
      "bn.js": "npm:bn.js@4.11.3",
      "brorand": "npm:brorand@1.0.5",
      "hash.js": "npm:hash.js@1.0.3",
      "inherits": "npm:inherits@2.0.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:encoding@0.1.12": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "iconv-lite": "npm:iconv-lite@0.4.13"
    },
    "npm:entities@1.0.0": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:entities@1.1.1": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:enzyme@2.3.0": {
      "cheerio": "npm:cheerio@0.20.0",
      "is-subset": "npm:is-subset@0.1.1",
      "lodash": "npm:lodash@4.12.0",
      "object-is": "npm:object-is@1.0.1",
      "object.assign": "npm:object.assign@4.0.3",
      "object.values": "npm:object.values@1.0.3",
      "react": "npm:react@15.0.2"
    },
    "npm:error-stack-parser@1.3.5": {
      "stackframe": "npm:stackframe@0.3.1"
    },
    "npm:es-abstract@1.5.0": {
      "es-to-primitive": "npm:es-to-primitive@1.1.1",
      "function-bind": "npm:function-bind@1.1.0",
      "is-callable": "npm:is-callable@1.1.3",
      "is-regex": "npm:is-regex@1.0.3"
    },
    "npm:es-to-primitive@1.1.1": {
      "is-callable": "npm:is-callable@1.1.3",
      "is-date-object": "npm:is-date-object@1.0.1",
      "is-symbol": "npm:is-symbol@1.0.1"
    },
    "npm:escodegen@1.8.0": {
      "esprima": "npm:esprima@2.7.2",
      "estraverse": "npm:estraverse@1.9.3",
      "esutils": "npm:esutils@2.0.2",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "optionator": "npm:optionator@0.8.1",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "source-map": "npm:source-map@0.2.0",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:evp_bytestokey@1.0.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "create-hash": "npm:create-hash@1.1.2",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0"
    },
    "npm:extsprintf@1.0.2": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:fbjs@0.1.0-alpha.10": {
      "core-js": "npm:core-js@1.2.6",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "promise": "npm:promise@7.1.1",
      "whatwg-fetch": "npm:whatwg-fetch@0.9.0"
    },
    "npm:fbjs@0.7.2": {
      "core-js": "npm:core-js@1.2.6",
      "isomorphic-fetch": "npm:isomorphic-fetch@2.2.1",
      "loose-envify": "npm:loose-envify@1.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "promise": "npm:promise@7.1.1",
      "ua-parser-js": "npm:ua-parser-js@0.7.10"
    },
    "npm:fbjs@0.8.2": {
      "core-js": "npm:core-js@1.2.6",
      "isomorphic-fetch": "npm:isomorphic-fetch@2.2.1",
      "loose-envify": "npm:loose-envify@1.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "promise": "npm:promise@7.1.1",
      "ua-parser-js": "npm:ua-parser-js@0.7.10"
    },
    "npm:forever-agent@0.6.1": {
      "http": "github:jspm/nodelibs-http@1.7.1",
      "https": "github:jspm/nodelibs-https@0.1.0",
      "net": "github:jspm/nodelibs-net@0.1.2",
      "tls": "github:jspm/nodelibs-tls@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:form-data@1.0.0-rc4": {
      "async": "npm:async@1.5.2",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "combined-stream": "npm:combined-stream@1.0.5",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "https": "github:jspm/nodelibs-https@0.1.0",
      "mime-types": "npm:mime-types@2.1.11",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:generate-function@2.0.0": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:generate-object-property@1.2.0": {
      "is-property": "npm:is-property@1.0.2"
    },
    "npm:getpass@0.1.6": {
      "assert-plus": "npm:assert-plus@1.0.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "tty": "github:jspm/nodelibs-tty@0.1.0"
    },
    "npm:glob@7.0.3": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "inflight": "npm:inflight@1.0.4",
      "inherits": "npm:inherits@2.0.1",
      "minimatch": "npm:minimatch@3.0.0",
      "once": "npm:once@1.3.3",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "path-is-absolute": "npm:path-is-absolute@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:global@4.3.0": {
      "process": "npm:process@0.5.2"
    },
    "npm:graceful-readlink@1.0.1": {
      "fs": "github:jspm/nodelibs-fs@0.1.2"
    },
    "npm:har-validator@2.0.6": {
      "chalk": "npm:chalk@1.1.3",
      "commander": "npm:commander@2.9.0",
      "is-my-json-valid": "npm:is-my-json-valid@2.13.1",
      "pinkie-promise": "npm:pinkie-promise@2.0.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:has-ansi@2.0.0": {
      "ansi-regex": "npm:ansi-regex@2.0.0"
    },
    "npm:has@1.0.1": {
      "function-bind": "npm:function-bind@1.1.0"
    },
    "npm:hash.js@1.0.3": {
      "inherits": "npm:inherits@2.0.1"
    },
    "npm:hawk@3.1.3": {
      "boom": "npm:boom@2.10.1",
      "cryptiles": "npm:cryptiles@2.0.5",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "hoek": "npm:hoek@2.16.3",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "sntp": "npm:sntp@1.0.9",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2",
      "url": "github:jspm/nodelibs-url@0.1.0"
    },
    "npm:history@2.1.1": {
      "deep-equal": "npm:deep-equal@1.0.1",
      "invariant": "npm:invariant@2.2.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "query-string": "npm:query-string@3.0.3",
      "warning": "npm:warning@2.1.0"
    },
    "npm:hoek@2.16.3": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:htmlparser2@3.8.3": {
      "domelementtype": "npm:domelementtype@1.1.3",
      "domhandler": "npm:domhandler@2.3.0",
      "domutils": "npm:domutils@1.5.1",
      "entities": "npm:entities@1.0.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:http-signature@1.1.1": {
      "assert-plus": "npm:assert-plus@0.2.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "jsprim": "npm:jsprim@1.2.2",
      "sshpk": "npm:sshpk@1.8.3",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:https-browserify@0.0.0": {
      "http": "github:jspm/nodelibs-http@1.7.1"
    },
    "npm:iconv-lite@0.4.13": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "string_decoder": "github:jspm/nodelibs-string_decoder@0.1.0",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:inflight@1.0.4": {
      "once": "npm:once@1.3.3",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "wrappy": "npm:wrappy@1.0.1"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:inline-style-prefixer@1.0.3": {
      "bowser": "npm:bowser@1.2.0",
      "inline-style-prefix-all": "npm:inline-style-prefix-all@1.1.0"
    },
    "npm:invariant@2.2.1": {
      "loose-envify": "npm:loose-envify@1.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:is-my-json-valid@2.13.1": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "generate-function": "npm:generate-function@2.0.0",
      "generate-object-property": "npm:generate-object-property@1.2.0",
      "jsonpointer": "npm:jsonpointer@2.0.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "xtend": "npm:xtend@4.0.1"
    },
    "npm:isomorphic-fetch@2.2.1": {
      "node-fetch": "npm:node-fetch@1.5.2",
      "whatwg-fetch": "npm:whatwg-fetch@0.9.0"
    },
    "npm:isstream@0.1.2": {
      "events": "github:jspm/nodelibs-events@0.1.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:jodid25519@1.0.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "jsbn": "npm:jsbn@0.1.0"
    },
    "npm:jsdom@7.2.2": {
      "abab": "npm:abab@1.0.3",
      "acorn": "npm:acorn@2.7.0",
      "acorn-globals": "npm:acorn-globals@1.0.9",
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "cssom": "npm:cssom@0.3.1",
      "cssstyle": "npm:cssstyle@0.2.34",
      "escodegen": "npm:escodegen@1.8.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "nwmatcher": "npm:nwmatcher@1.3.7",
      "parse5": "npm:parse5@1.5.1",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "request": "npm:request@2.72.0",
      "sax": "npm:sax@1.2.1",
      "symbol-tree": "npm:symbol-tree@3.1.4",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2",
      "tough-cookie": "npm:tough-cookie@2.2.2",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0",
      "webidl-conversions": "npm:webidl-conversions@2.0.1",
      "whatwg-url-compat": "npm:whatwg-url-compat@0.6.5",
      "xml-name-validator": "npm:xml-name-validator@2.0.1"
    },
    "npm:jsonpointer@2.0.0": {
      "assert": "github:jspm/nodelibs-assert@0.1.0"
    },
    "npm:jsprim@1.2.2": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "extsprintf": "npm:extsprintf@1.0.2",
      "json-schema": "npm:json-schema@0.2.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "util": "github:jspm/nodelibs-util@0.1.0",
      "verror": "npm:verror@1.3.6"
    },
    "npm:levn@0.3.0": {
      "prelude-ls": "npm:prelude-ls@1.1.2",
      "type-check": "npm:type-check@0.3.2"
    },
    "npm:lodash.keys@3.1.2": {
      "lodash._getnative": "npm:lodash._getnative@3.9.1",
      "lodash.isarguments": "npm:lodash.isarguments@3.0.8",
      "lodash.isarray": "npm:lodash.isarray@3.0.4"
    },
    "npm:lodash@4.12.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:loose-envify@1.1.0": {
      "js-tokens": "npm:js-tokens@1.0.3",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:miller-rabin@4.0.0": {
      "bn.js": "npm:bn.js@4.11.3",
      "brorand": "npm:brorand@1.0.5"
    },
    "npm:mime-db@1.23.0": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:mime-types@2.1.11": {
      "mime-db": "npm:mime-db@1.23.0",
      "path": "github:jspm/nodelibs-path@0.1.0"
    },
    "npm:minimatch@3.0.0": {
      "brace-expansion": "npm:brace-expansion@1.1.4",
      "path": "github:jspm/nodelibs-path@0.1.0"
    },
    "npm:node-fetch@1.5.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "encoding": "npm:encoding@0.1.12",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "https": "github:jspm/nodelibs-https@0.1.0",
      "is-stream": "npm:is-stream@1.1.0",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0",
      "zlib": "github:jspm/nodelibs-zlib@0.1.0"
    },
    "npm:node-uuid@1.4.7": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0"
    },
    "npm:nth-check@1.0.1": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "boolbase": "npm:boolbase@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:nwmatcher@1.3.7": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:oauth-sign@0.8.2": {
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "querystring": "github:jspm/nodelibs-querystring@0.1.0"
    },
    "npm:object.assign@4.0.3": {
      "define-properties": "npm:define-properties@1.1.2",
      "function-bind": "npm:function-bind@1.1.0",
      "object-keys": "npm:object-keys@1.0.9"
    },
    "npm:object.values@1.0.3": {
      "define-properties": "npm:define-properties@1.1.2",
      "es-abstract": "npm:es-abstract@1.5.0",
      "function-bind": "npm:function-bind@1.1.0",
      "has": "npm:has@1.0.1"
    },
    "npm:once@1.3.3": {
      "wrappy": "npm:wrappy@1.0.1"
    },
    "npm:optionator@0.8.1": {
      "deep-is": "npm:deep-is@0.1.3",
      "fast-levenshtein": "npm:fast-levenshtein@1.1.3",
      "levn": "npm:levn@0.3.0",
      "prelude-ls": "npm:prelude-ls@1.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "type-check": "npm:type-check@0.3.2",
      "wordwrap": "npm:wordwrap@1.0.0"
    },
    "npm:pako@0.2.8": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:parse-asn1@5.0.0": {
      "asn1.js": "npm:asn1.js@4.6.0",
      "browserify-aes": "npm:browserify-aes@1.0.6",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "create-hash": "npm:create-hash@1.1.2",
      "evp_bytestokey": "npm:evp_bytestokey@1.0.0",
      "pbkdf2": "npm:pbkdf2@3.0.4",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:parse-domain@0.2.1": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0"
    },
    "npm:parse5@1.5.1": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:path-is-absolute@1.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:pbkdf2@3.0.4": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "create-hmac": "npm:create-hmac@1.1.4",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:pinkie-promise@2.0.1": {
      "pinkie": "npm:pinkie@2.0.4"
    },
    "npm:process-nextick-args@1.0.7": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process@0.11.3": {
      "assert": "github:jspm/nodelibs-assert@0.1.0"
    },
    "npm:promise@7.1.1": {
      "asap": "npm:asap@2.0.3",
      "fs": "github:jspm/nodelibs-fs@0.1.2"
    },
    "npm:public-encrypt@4.0.0": {
      "bn.js": "npm:bn.js@4.11.3",
      "browserify-rsa": "npm:browserify-rsa@4.0.1",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "create-hash": "npm:create-hash@1.1.2",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "parse-asn1": "npm:parse-asn1@5.0.0",
      "randombytes": "npm:randombytes@2.0.3"
    },
    "npm:punycode@1.3.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:query-string@3.0.3": {
      "strict-uri-encode": "npm:strict-uri-encode@1.1.0"
    },
    "npm:radium@0.17.1": {
      "array-find": "npm:array-find@1.0.0",
      "exenv": "npm:exenv@1.2.1",
      "inline-style-prefixer": "npm:inline-style-prefixer@1.0.3"
    },
    "npm:randombytes@2.0.3": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:react-addons-test-utils@15.0.2": {
      "react": "npm:react@15.0.2"
    },
    "npm:react-dom@15.0.2": {
      "react": "npm:react@15.0.2"
    },
    "npm:react-helmet@3.1.0": {
      "deep-equal": "npm:deep-equal@1.0.1",
      "object-assign": "npm:object-assign@4.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "react-side-effect": "npm:react-side-effect@1.0.2",
      "shallowequal": "npm:shallowequal@0.2.2",
      "warning": "npm:warning@2.1.0"
    },
    "npm:react-metrics@1.2.1": {
      "core-js": "npm:core-js@2.4.0",
      "deep-equal": "npm:deep-equal@1.0.1",
      "eventemitter3": "npm:eventemitter3@1.2.0",
      "fbjs": "npm:fbjs@0.7.2",
      "hoist-non-react-statics": "npm:hoist-non-react-statics@1.0.6",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "querystring": "npm:querystring@0.2.0",
      "rimraf": "npm:rimraf@2.5.2"
    },
    "npm:react-proxy@1.1.8": {
      "lodash": "npm:lodash@4.12.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "react-deep-force-update": "npm:react-deep-force-update@1.0.1"
    },
    "npm:react-router@2.4.0": {
      "history": "npm:history@2.1.1",
      "hoist-non-react-statics": "npm:hoist-non-react-statics@1.0.6",
      "invariant": "npm:invariant@2.2.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "react": "npm:react@15.0.2",
      "warning": "npm:warning@2.1.0"
    },
    "npm:react-side-effect@1.0.2": {
      "fbjs": "npm:fbjs@0.1.0-alpha.10"
    },
    "npm:react-transform-hmr@1.0.4": {
      "global": "npm:global@4.3.0",
      "react-proxy": "npm:react-proxy@1.1.8"
    },
    "npm:react-transform-jspm-hmr@1.0.1": {
      "global": "npm:global@4.3.0",
      "react-proxy": "npm:react-proxy@1.1.8"
    },
    "npm:react-wildcat-handoff@4.0.0": {
      "cookies-js": "npm:cookies-js@1.2.2",
      "exenv": "npm:exenv@1.2.1",
      "history": "npm:history@2.1.1",
      "isomorphic-fetch": "npm:isomorphic-fetch@2.2.1",
      "parse-domain": "npm:parse-domain@0.2.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "react": "npm:react@15.0.2",
      "react-dom": "npm:react-dom@15.0.2",
      "react-helmet": "npm:react-helmet@3.1.0",
      "react-router": "npm:react-router@2.4.0",
      "react-wildcat-hot-reloader": "npm:react-wildcat-hot-reloader@4.0.0"
    },
    "npm:react-wildcat-hot-reloader@4.0.0": {
      "debug": "npm:debug@2.2.0",
      "exenv": "npm:exenv@1.2.1"
    },
    "npm:react-wildcat-prefetch@4.0.0": {
      "exenv": "npm:exenv@1.2.1",
      "hoist-non-react-statics": "npm:hoist-non-react-statics@1.0.6",
      "invariant": "npm:invariant@2.2.1",
      "react": "npm:react@15.0.2"
    },
    "npm:react@15.0.2": {
      "fbjs": "npm:fbjs@0.8.2",
      "loose-envify": "npm:loose-envify@1.1.0",
      "object-assign": "npm:object-assign@4.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:readable-stream@1.1.14": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "core-util-is": "npm:core-util-is@1.0.2",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "isarray": "npm:isarray@0.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream-browserify": "npm:stream-browserify@1.0.0",
      "string_decoder": "npm:string_decoder@0.10.31"
    },
    "npm:readable-stream@2.0.6": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "core-util-is": "npm:core-util-is@1.0.2",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "isarray": "npm:isarray@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "process-nextick-args": "npm:process-nextick-args@1.0.7",
      "string_decoder": "npm:string_decoder@0.10.31",
      "util-deprecate": "npm:util-deprecate@1.0.2"
    },
    "npm:redbox-react@1.2.4": {
      "error-stack-parser": "npm:error-stack-parser@1.3.5",
      "object-assign": "npm:object-assign@4.1.0",
      "react": "npm:react@15.0.2"
    },
    "npm:request@2.72.0": {
      "aws-sign2": "npm:aws-sign2@0.6.0",
      "aws4": "npm:aws4@1.4.1",
      "bl": "npm:bl@1.1.2",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "caseless": "npm:caseless@0.11.0",
      "combined-stream": "npm:combined-stream@1.0.5",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "extend": "npm:extend@3.0.0",
      "forever-agent": "npm:forever-agent@0.6.1",
      "form-data": "npm:form-data@1.0.0-rc4",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "har-validator": "npm:har-validator@2.0.6",
      "hawk": "npm:hawk@3.1.3",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "http-signature": "npm:http-signature@1.1.1",
      "https": "github:jspm/nodelibs-https@0.1.0",
      "is-typedarray": "npm:is-typedarray@1.0.0",
      "isstream": "npm:isstream@0.1.2",
      "json-stringify-safe": "npm:json-stringify-safe@5.0.1",
      "mime-types": "npm:mime-types@2.1.11",
      "node-uuid": "npm:node-uuid@1.4.7",
      "oauth-sign": "npm:oauth-sign@0.8.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "qs": "npm:qs@6.1.0",
      "querystring": "github:jspm/nodelibs-querystring@0.1.0",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "stringstream": "npm:stringstream@0.0.5",
      "tough-cookie": "npm:tough-cookie@2.2.2",
      "tunnel-agent": "npm:tunnel-agent@0.4.3",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0",
      "zlib": "github:jspm/nodelibs-zlib@0.1.0"
    },
    "npm:rimraf@2.5.2": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "glob": "npm:glob@7.0.3",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:ripemd160@1.0.1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:sax@1.2.1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "string_decoder": "github:jspm/nodelibs-string_decoder@0.1.0"
    },
    "npm:sha.js@2.4.5": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:shallowequal@0.2.2": {
      "lodash.keys": "npm:lodash.keys@3.1.2"
    },
    "npm:sntp@1.0.9": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "dgram": "github:jspm/nodelibs-dgram@0.1.0",
      "dns": "github:jspm/nodelibs-dns@0.1.0",
      "hoek": "npm:hoek@2.16.3",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:source-map@0.2.0": {
      "amdefine": "npm:amdefine@1.0.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:sshpk@1.8.3": {
      "asn1": "npm:asn1@0.2.3",
      "assert-plus": "npm:assert-plus@1.0.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "dashdash": "npm:dashdash@1.13.1",
      "ecc-jsbn": "npm:ecc-jsbn@0.1.1",
      "getpass": "npm:getpass@0.1.6",
      "jodid25519": "npm:jodid25519@1.0.2",
      "jsbn": "npm:jsbn@0.1.0",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "tweetnacl": "npm:tweetnacl@0.13.3",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:stackframe@0.3.1": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:stream-browserify@1.0.0": {
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "readable-stream": "npm:readable-stream@1.1.14"
    },
    "npm:string_decoder@0.10.31": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:stringstream@0.0.5": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "string_decoder": "github:jspm/nodelibs-string_decoder@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0",
      "zlib": "github:jspm/nodelibs-zlib@0.1.0"
    },
    "npm:strip-ansi@3.0.1": {
      "ansi-regex": "npm:ansi-regex@2.0.0"
    },
    "npm:supports-color@2.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:timers-browserify@1.4.2": {
      "process": "npm:process@0.11.3"
    },
    "npm:tough-cookie@2.2.2": {
      "net": "github:jspm/nodelibs-net@0.1.2",
      "punycode": "github:jspm/nodelibs-punycode@0.1.0",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:tr46@0.0.3": {
      "process": "github:jspm/nodelibs-process@0.1.2",
      "punycode": "github:jspm/nodelibs-punycode@0.1.0",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:tunnel-agent@0.4.3": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "https": "github:jspm/nodelibs-https@0.1.0",
      "net": "github:jspm/nodelibs-net@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "tls": "github:jspm/nodelibs-tls@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:type-check@0.3.2": {
      "prelude-ls": "npm:prelude-ls@1.1.2"
    },
    "npm:ua-parser-js@0.7.10": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:url@0.10.3": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "punycode": "npm:punycode@1.3.2",
      "querystring": "npm:querystring@0.2.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:util-deprecate@1.0.2": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:verror@1.3.6": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "extsprintf": "npm:extsprintf@1.0.2",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:vm-browserify@0.0.4": {
      "indexof": "npm:indexof@0.0.1"
    },
    "npm:warning@2.1.0": {
      "loose-envify": "npm:loose-envify@1.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:whatwg-url-compat@0.6.5": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "punycode": "github:jspm/nodelibs-punycode@0.1.0",
      "tr46": "npm:tr46@0.0.3"
    }
  }
});
