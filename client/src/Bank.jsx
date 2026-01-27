//The bank is in charge of depositing checks and cash, withdrawing money, collecting loan amounts due, and converting TANF benefits.

//The Add Funds and Withdraw functions should do as they say. No need for auto-populating.

//Unless Janet suggests otherwise, accounts should be allowed to go into the negatives. If a bank teller wishes to deny a transaction based on that, it's up to them.

//Loan payments work the same way as mortgage/rent payments. They can be paid in part. When an amount is subtracted, that should update the 'remaining' total. When that amount is zero, the box should gray out and it should say 'paid'.

//This is an example. Delete it when you need to.

import React from 'react'

export default function Bank() {
    return (
        <div style={{ padding: 20 }}>
            <h1>U Trust US National Bank</h1>
            {/* May become form fields based on after talking to Janet*/}
            <p>Example (what it would look like)</p>
            <div className="container">
                <div className="row">
                    <div className="col-2">
                        <p>Name</p>
                    </div>
                    <div className="col-1">
                        <p>Amount</p>
                    </div>
                    <div className="col-3">
                        <p>Add Funds to Account/Cash Check</p>
                    </div>
                    <div className="col-3">
                        <p>Withdraw</p>
                    </div>
                    <div className="col-3">
                        <p>Loan Payment</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-2">
                        <p>Aber</p>
                    </div>
                    <div className="col-1">
                        <p>$500</p>
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
                        <p>550 remaining</p><br></br>
                        <form>
                            <label for="textbox">$</label>
                            <input type="text" id="textbox" name="textbox"></input>

                        </form><button>PAY</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-2">
                        <p>Boling</p>
                    </div>
                    <div className="col-1">
                        <p>$600</p>
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
                        <p>400 remaining</p><br></br>
                        <form>
                            <label for="textbox">$</label>
                            <input type="text" id="textbox" name="textbox"></input>

                        </form><button>PAY</button>
                    </div>
                </div>
            </div>

        </div>
    )
}