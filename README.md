# LOCAL GYM FINDER

## Introduction

The local gym finder app is web application that allows users to view local gyms in their area. A logged in user can interact with the application, leaving reviews, deleting gyms, adding workout classes and leaving notes on their own personal gyms for reference. A google maps feature was added so that users can see where each gym is located on a map based on the address provided for each gym. 

## MODELS

This application has db tables that are as follows:

GYM
USER
WORKOUT CLASSES
REVIEWS
GYM_USER - many to many 
GYM USER NOTES

These tables hold the data that is input by the client.
A gym can have many users, and a user can have many gyms.
A workout class belongs to one gym, a gym can have many workout classes.
A review belongs to one gym, a gym can have many reviews.
A review belongs to one user, a user can write many reviews.


### RESOURCES

The resources folder holds all the functions definted to handle the http verbs for the client requests. 

### ROUTES

The various routes used in this applicaton follow RESTful route conventions in order to allow for ease and readability.

### COMPONENTS

The front end has many components which handle the user interactions on the front end.

