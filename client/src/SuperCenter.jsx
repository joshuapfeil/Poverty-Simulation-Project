//Supercenter sells groceries, clothing, misc, and prescriptions. They also hire teens/young adults for part time work

//Part-time work will be entirely handled cash-only.

//Food, clothing, misc, and prescriptions must be paid IN FULL. Boxes only allow editing because of Luck of the Draw scenarios, where money might be added/subtracted from this total. The fields should be auto-populated with that family's regular amount. When the amount is paid, the box should gray out and it should say 'paid.'

//Families that don't have prescription, misc., or clothes payments should have nothing return in those columns.

//This is an example. Delete it when you need to.

import React from 'react'

export default function SuperCenter() {
    return (
        <div style={{ padding: 20 }}>
            <h1>Food-A-Rama SuperCenter</h1>
            {/* May become form fields based on after talking to Janet*/}
            <p>Example (what it would look like)</p>
            <div className="container">
                <div className="row">
                    <div className="col-1">
                        <p>Name</p>
                    </div>
                    <div className="col-4">
                        <p>Food</p>
                    </div>
                    <div className="col-2">
                        <p>Clothes</p>
                    </div>
                    <div className="col-2">
                        <p>Misc</p>
                    </div>
                    <div className="col-2">
                        <p>Prescriptions</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-1">
                        <p>Boling</p>
                    </div>
                    <div className="col-4">
                        <div className="container">
                            <div className="row">
                                <div className="col-3">
                                    <p>Wk1</p>
                                </div>
                                <div className="col-3">
                                    <p>Wk2</p>
                                </div>
                                <div className="col-3">
                                    <p>Wk3</p>
                                </div>
                                <div className="col-3">
                                    <p>Wk4</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-3">
                                    <form>
                                        <label for="textbox">$</label>
                                        <input type="text" id="textbox" name="textbox"></input>
                                    </form><button>PAY</button>
                                </div>
                                <div className="col-3">
                                    <form>
                            <label for="textbox">$</label>
                                <input type="text" id="textbox" name="textbox"></input>
                                  
                                        </form><button>PAY</button>
                                </div>
                                <div className="col-3">
                                    <form>
                            <label for="textbox">$</label>
                                <input type="text" id="textbox" name="textbox"></input>
                                  
                                        </form><button>PAY</button>
                                </div>
                                <div className="col-3">
                                    <form>
                            <label for="textbox">$</label>
                                <input type="text" id="textbox" name="textbox"></input>
                                  
                                        </form><button>PAY</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-2">
                        <form>
                            <label for="textbox">$</label>
                                <input type="text" id="textbox" name="textbox"></input>
                                  
                                        </form><button>PAY</button>
                    </div>
                    <div className="col-2">
                        <form>
                            <label for="textbox">$</label>
                                <input type="text" id="textbox" name="textbox"></input>
                                  
                                        </form><button>PAY</button>
                    </div>
                    <div className="col-2">
                        <p>X</p>
                    </div>
                </div>

            </div>
        </div>
    )
}