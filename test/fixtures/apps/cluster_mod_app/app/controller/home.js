'use strict';

exports.index = async function() {
  this.body = 'hi cluster';
};

exports.getClusterPort = async function() {
  this.body = this.app._options.clusterPort;
};

exports.getHosts = async function() {
  this.body = this.app.val && this.app.val.map(url => url.host).join(',');
};

exports.publish = async function() {
  const val = this.request.body.value;
  this.app.registryClient.publish({
    dataId: 'demo.DemoService',
    publishData: `dubbo://${val}:20880/demo.DemoService?anyhost=true&application=demo-provider&dubbo=2.0.0&generic=false&interface=demo.DemoService&loadbalance=roundrobin&methods=sayHello&owner=william&pid=81281&side=provider&timestamp=1481613276143`,
  });
  this.body = 'ok';
};
