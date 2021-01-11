const expect = require('chai').expect;
const sinon = require('sinon');

const sequelize = require('../database/database');
const authControllers = require('../controllers/auth');
const { should } = require('chai');
const Consumer = require('../models/consumer');

function areEqual(consumer, testConsumer) {
    const name = consumer.getName();
    const email = consumer.getEmail();
    const password = consumer.getPassword();
    const shippingAddress = consumer.getShippingAddress();
    // const lastVisited = consumer.getLastVisited();
    expect(name).to.be.equal(testConsumer.name);
    expect(email).to.be.equal(testConsumer.email);
    expect(password).to.be.equal(testConsumer.password);
    expect(shippingAddress).to.be.equal(testConsumer.shippingAddress);
    // expect(lastVisited).to.be.equal(testConsumer.lastVisited);
}

describe('Auth - controller', function () {
    const testConsumer = {
        email: 'test@test.comauth',
        password: 'testauth',
        shippingAddress: 'shippingAddressauth',
        name: 'testerauth'
    }

    // before(function(done) {
    //     Consumer.create(testConsumer)
    //     .then(consumer => {
    //         testConsumer.id = consumer.getId();
    //         done();
    //     })
    // });

    it('should sign up testConsumer', function(done) {
        const req = {
            body: {
                type: 'consumer', 
                ...testConsumer, 
                repassword: testConsumer.password
            }
        };
        const res = {
            redirect: (str) => {
                expect(str).to.equal('/sign-in');
                Consumer
                    .findAll({where: {email: testConsumer.email}})
                    .then(consumers => {
                        // console.log(consumers[0])
                        areEqual(consumers[0], testConsumer);
                        testConsumer.id = consumers[0].getId();
                        done();
                    })
            }
        }
        authControllers.postSignUpConsumer(req, res, () => {})
    })

    it('should find the user for given cookies', function(done) {
        let req = {
            cookies: {
                userId: testConsumer.id,
                userType: 'consumer'
            }
        }
        authControllers.findUser(req, {}, () => {
            areEqual(req.user, testConsumer);
            done();
        })
    })

    it('should delete the cookies', function() {
        let cookiesToBeDeleted = [];
        let res = {
            clearCookie: (str) => {
                cookiesToBeDeleted.push(str);
            },
            redirect: function() {}
        }
        authControllers.signOut({}, res, () => {})
        // console.log(cookiesToBeDeleted);
        expect(cookiesToBeDeleted).to.have.property('length', 2);
        expect(cookiesToBeDeleted[0]).to.equal('userId');
        expect(cookiesToBeDeleted[1]).to.equal('userType');
        // done();
    })

    it('should call "next" for non-guest users', function(done) {
        let req = {
            cookies: {
                userId: testConsumer.id,
                userType: 'consumer'
            }
        }
        authControllers.findUser(req, {}, () => {
            let isCalled = false;
            authControllers.getSignIn(req, {}, () => {isCalled = true;})
            expect(isCalled).to.equal(true);
            done();
        })
    })
    
    it('should sign testConsumer in', function(done) {
        const req = {
            body: {
                email: testConsumer.email,
                password: testConsumer.password,
            }
        };
        const cookies = {};
        const res = {
            cookie: function(name, value) {
                cookies[name] = value;
            },
            redirect: () => {
                expect(cookies).to.have.property('userType', 'consumer');
                expect(cookies).to.have.property('userId', testConsumer.id);
                done();
            }
        }
        authControllers.postSignInConsumer(req, res, () => {})
    })
     
    after(function(done) {
        Consumer
            .findById(testConsumer.id)
            .then(consumer => {
                return consumer.destroy();
            })
            .then(() => {
                done();
            })
    })
});