//GENERAL EMPLOYER HAS THE WIDEST VARIETY OF TASKS:
// Make sure that employees come in and work their entire shift
// Accept or deny unpaid leave requests
// Hand out paychecks at the end of each week
// Hire and fire workers as needed


//The employer can only hire one person per week, and the hiring process takes two weeks... there will only be a maximum of 2-3 people hired during the simulation. Currently, even if their family has a bank account, we're going to have new hires deal in paper checks. This prevents a wide variety of small issues we would have to code in and around.


//This page will handle employees being labeled as working/on leave, give direct deposit to those who did work, and have the ability to fire employees.

//Each worker's paycheck will be auto-filled. The ability to pay this amount should be grayed out unless the 'worked' box is checked and the 'leave' box is not! Once the paycheck is paid, the box should gray out permanently, and it should say it was paid successfully.

//The 'fired' checkbox should just gray out the employee's entire row. If by some miracle they are rehired (or if the fire button was hit on accident) it can just be unchecked.


//This is an example. Delete it when you need to.

import React from 'react'

export default function Employer() {
    return (
        <div style={{ padding: 20 }}>
            <h1>General Employer</h1>
            {/* Check people in and out, came to work > receive paycheck for the work they did*/}
            <p>Example (what it would look like)</p>
            <div className="container">
                <div className="row">
                    <div className="col-2">
                        <p>Name</p>
                    </div>
                    <div className="col-2">
                        <p>Week 1</p>
                    </div>
                    <div className="col-2">
                        <p>Week 2</p>
                    </div>
                      <div className="col-2">
                        <p>Week 3</p>
                    </div>
                      <div className="col-2">
                        <p>Week 4</p>
                    </div>
                      <div className="col-2">
                        <p>trashcanemoji</p>
                    </div>
                    
                </div>
                 <div className="row">
                    <div className="col-2">
                        <p>Aber</p>
                    </div>
                    <div className="col-2">
                        <div className="container">
                            <div class="row">
                                <div class="col-6">
                                Worked
                                </div>
                                <div class="col-6">
                                Leave
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6">
                               <input type="checkbox" name="lotD1" value="Bike"></input>
                                </div>
                                <div class="col-6">
                                <input type="checkbox" name="lotD1" value="Bike"></input>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    $600 <button>Submit</button>
                                </div>
                            </div>
                            </div>
                    </div>
                    <div className="col-2">
                         <div className="container">
                            <div class="row">
                                <div class="col-6">
                                Worked
                                </div>
                                <div class="col-6">
                                Leave
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6">
                               <input type="checkbox" name="lotD1" value="Bike"></input>
                                </div>
                                <div class="col-6">
                                <input type="checkbox" name="lotD1" value="Bike"></input>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    $600 <button>Submit</button>
                                </div>
                            </div>
                            </div>
                    </div>
                      <div className="col-2">
                          <div className="container">
                            <div class="row">
                                <div class="col-6">
                                Worked
                                </div>
                                <div class="col-6">
                                Leave
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6">
                               <input type="checkbox" name="lotD1" value="Bike"></input>
                                </div>
                                <div class="col-6">
                                <input type="checkbox" name="lotD1" value="Bike"></input>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    $600 <button>Submit</button>
                                </div>
                            </div>
                            </div>
                    </div>
                      <div className="col-2">
                          <div className="container">
                            <div class="row">
                                <div class="col-6">
                                Worked
                                </div>
                                <div class="col-6">
                                Leave
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6">
                               <input type="checkbox" name="lotD1" value="Bike"></input>
                                </div>
                                <div class="col-6">
                                <input type="checkbox" name="lotD1" value="Bike"></input>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    $600 <button>Submit</button>
                                </div>
                            </div>
                            </div>
                    </div>
                      <div className="col-2">
                        <input type="checkbox" name="lotD1" value="Bike"></input><label for="lotD1"> Fire?</label>
                    </div>
                    
                </div>
                 <div className="row">
                    <div className="col-2">
                        <p>Boling</p>
                    </div>
                    <div className="col-2">
                        <div className="container">
                            <div class="row">
                                <div class="col-6">
                                Worked
                                </div>
                                <div class="col-6">
                                Leave
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6">
                               <input type="checkbox" name="lotD1" value="Bike"></input>
                                </div>
                                <div class="col-6">
                                <input type="checkbox" name="lotD1" value="Bike"></input>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    $600 <button>Submit</button>
                                </div>
                            </div>
                            </div>
                    </div>
                    <div className="col-2">
                         <div className="container">
                            <div class="row">
                                <div class="col-6">
                                Worked
                                </div>
                                <div class="col-6">
                                Leave
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6">
                               <input type="checkbox" name="lotD1" value="Bike"></input>
                                </div>
                                <div class="col-6">
                                <input type="checkbox" name="lotD1" value="Bike"></input>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    $600 <button>Submit</button>
                                </div>
                            </div>
                            </div>
                    </div>
                      <div className="col-2">
                          <div className="container">
                            <div class="row">
                                <div class="col-6">
                                Worked
                                </div>
                                <div class="col-6">
                                Leave
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6">
                               <input type="checkbox" name="lotD1" value="Bike"></input>
                                </div>
                                <div class="col-6">
                                <input type="checkbox" name="lotD1" value="Bike"></input>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    $600 <button>Submit</button>
                                </div>
                            </div>
                            </div>
                    </div>
                      <div className="col-2">
                          <div className="container">
                            <div class="row">
                                <div class="col-6">
                                Worked
                                </div>
                                <div class="col-6">
                                Leave
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6">
                               <input type="checkbox" name="lotD1" value="Bike"></input>
                                </div>
                                <div class="col-6">
                                <input type="checkbox" name="lotD1" value="Bike"></input>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    $600 <button>Submit</button>
                                </div>
                            </div>
                            </div>
                    </div>
                      <div className="col-2">
                        <input type="checkbox" name="lotD1" value="Bike"></input><label for="lotD1"> Fire?</label>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}