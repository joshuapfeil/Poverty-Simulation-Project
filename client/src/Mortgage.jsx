//Mortgage office takes mortgage payments from homeowners, and rent payments from renters

//The simulation allows for families to pay their mortgage/rent in parts. The 'amount due' field should auto-populate with the family's amount due at the start of the simulation. When an amount is submittied through the 'Pay' function, that amount should be subtracted from 'amount due'. When it is paid off, the box should gray out, and it should say 'paid'.

//question for Janet: some families with homes have potential for reduced rent. how is this calculated?

//This is an example. Delete it when you need to.

import React from 'react'

export default function Mortgage() {
    return (
        <div style={{ padding: 20 }}> 
            <h1>Sweaney Mortgage & Realty</h1>
            {/* Amount due is unchangeable. It would automatically subtract whatever people paid in the amount paid form field.*/}
            <p>Example (what it would look like)</p>
            <div className="container">
                <div class="row">
                    <div class="col-4">
                        <p>Name</p>
                    </div>
                     <div class="col-4">
                        <p>Amount Due</p>
                    </div>
                     <div class="col-4">
                        <p>Pay</p>
                    </div>
                </div>
                 <div class="row">
                    <div class="col-4">
                        <p>Aber</p>
                    </div>
                     <div class="col-4">
                        <p>650</p>
                    </div>
                     <div class="col-4">
                        <form>
                            <label for="textbox">$</label>
                                <input type="text" id="textbox" name="textbox"></input>
                                  
                                        </form><button>Submit</button>
                    </div>
                </div>
                 <div class="row">
                    <div class="col-4">
                        <p>Boling</p>
                    </div>
                     <div class="col-4">
                        <p>400</p>
                    </div>
                     <div class="col-4">
                        <form>
                            <label for="textbox">$</label>
                                <input type="text" id="textbox" name="textbox"></input>
                                  
                                        </form><button>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}