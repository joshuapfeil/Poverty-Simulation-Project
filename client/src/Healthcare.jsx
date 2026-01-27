//Healthcare treats paients, gives out diagnoses and creates prescriptions

import React from 'react'

export default function Healthcare() {
    return (
        <div>
            <h1>Community Healthcare</h1>
            <h2>Waiting on Feedback.</h2>
            <p>Children under medicaid do not pay</p>
            <form>
                {/* //dropdown specifying type of patient and how much theyll pay*/}
               
                <select name="family">
                    <option value="" disabled selected>Select a family--</option>
                    <option value="insured">Insured</option>
                    <option value="medicaid">Medicaid (Adult)</option>
                    <option value="medicare">Medicare</option>
                    <option value="noninsured">Not Insured</option>
                    {/* attribute drop down to amount of money see comments below */}
                </select>
            </form>

        </div>
    )
}

//fill prescriptions
//insured $20 copay
//medicaid $1 for adults,
// medicaid no co-pay for children
//medicare $40 towards their deductible
//no insurance $80