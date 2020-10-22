const utils = require('../utils');
const chai = require('chai');
const expect = chai.expect;

describe("template.json", function(){
  beforeEach(function(){

  });
  it("check number of versions", function(){
    expect(utils.findTotalExistingVersions()).to.equal(2);
    expect(utils.findTotalExistingVersions()).not.to.equal(1);
  });
  it("Check if we can access each value", function(){
    let value = [{
      "added":[],
      "changed":[],
      "deprecated":[]
    }];
    expect(utils.findDateValue("21-10-2020")).to.equal(value);
  });
});
