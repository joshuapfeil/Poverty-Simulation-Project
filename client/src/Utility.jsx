// Utility company collects gas, phone, and electric bills from families

//Gas, phone, and electric bills must be paid IN FULL. Boxes only allow editing because of Luck of the Draw scenarios, where money might be added/subtracted from this total. The fields should be auto-populated with that family's regular amount. When the amount is paid, the box should gray out and it should say 'paid.'

//This is an example. Delete it when you need to.

import React from 'react'

export default function Utility() {
    return (
        <div style={{ padding: 20 }} className="container">
            <h1>Friendly Utility Company</h1>
            {/* All pages should have a box similar to the family admin page
            Names need to auto-populate from backend with a table with a search function
            When paid, the text should be grayed out
            Luck of the draw gives discount of $20. Luck of the draw checkbox would take off $20 from the amount needed to pay. Those fields are gas, electric, and phone.*/}
            <p>Table Example (what it would look like)</p>
            <div className="row">
                <div className="col-3">
                    <p>Family Name</p><br></br>
                    <p>Aber</p>

                </div>
                <div className="col-3">
                    <p>Gas</p><br></br>
                    <form>
                        <label for="textbox">$</label>
                        <input type="text" id="textbox" name="textbox"></input>
                    </form><button>PAY</button>
                    <br></br>
                </div>
                <div className="col-3">
                    <p>Phone</p><br></br>
                    <form>
                        <label for="textbox">$</label>
                        <input type="text" id="textbox" name="textbox"></input>
                    </form><button>PAY</button>
                    <br></br>
                </div>
                <div className="col-3">
                    <p>Electric</p><br></br>
                    <form>
                        <label for="textbox">$</label>
                        <input type="text" id="textbox" name="textbox"></input>
                    </form><button>PAY</button>
                    <br></br>
                </div>
            </div>
            <div className="row">
                <div className="col-3">
                    <p>Boling</p><br></br>


                </div>
                <div className="col-3">
                    <p>Gas</p><br></br>
                    <form>
                        <label for="textbox">$</label>
                        <input type="text" id="textbox" name="textbox"></input>
                    </form><button>PAY</button>
                    <br></br>
                </div>
                <div className="col-3">
                    <p>Phone</p><br></br>
                    <form>
                        <label for="textbox">$</label>
                        <input type="text" id="textbox" name="textbox"></input>
                    </form><button>PAY</button>
                    <br></br>
                </div>
                <div className="col-3">
                    <p>Electric</p><br></br>
                    <form>
                        <label for="textbox">$</label>
                        <input type="text" id="textbox" name="textbox"></input>
                    </form><button>PAY</button>
                    <br></br>
                </div>
            </div>

        </div>
    )
}