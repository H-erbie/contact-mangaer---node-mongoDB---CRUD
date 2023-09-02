const asyncHandler = require('express-async-handler')
const Contact = require('../modles/contactModels')


//@desc get all contacts
//@route get /api/contacts
//@access private
//retrieve all contacts
const getContacts = asyncHandler(async(req, res) => {
  const contacts = await Contact.find({user_id: req.user.id})
  res.status(200).json(contacts);
});

//@desc create new contacts
//@route get /api/contacts
//@access private
const createContact = asyncHandler(async(req, res) => {
    console.log("request body is: ",req.body)
    const {name, email, phone} = req.body;
    if(!name|!email|!phone){
        res.status(400);
        throw new Error ('All fields are mandatory')
    }
    const contact =
     await Contact.create({
      name,
      email,
      phone,
      user_id: req.user.id,
    })
  res.status(201).json(contact);
});

//@desc get contact
//@route get /api/contacts
//@access private
const getContact = asyncHandler( async(req, res) => {
  const contact = await Contact.findById(req.params.id)
  if(!contact){
    res.status(404)
    throw new Error('contact not found!')
  }
  res.status(200).json(contact);
});


//@desc update contact
//@route get /api/contacts
//@access private
const updateContact = asyncHandler(async(req, res) => {
  const contact = await Contact.findById(req.params.id)
  if(!contact){
    res.status(404)
    throw new Error('contact not found!')
  }
  if(contact.user.id.toString() !== req.user.id){
    res.status(403)
    throw new Error ('User does not have permission to updated other user contacts')
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    {new: true}
  )

  res.status(200).json(updatedContact);
});

//@desc delete contact
//@route get /api/contacts
//@access private
const deleteContact = asyncHandler(async(req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id)
  if(!contact){
    res.status(404)
    throw new Error('contact not found!')
  }
  if(contact.user.id.toString() !== req.user.id){
    res.status(403)
    throw new Error ('User does not have permission to delete other user contacts')
  }
  res.status(200).json(contact);

});

module.exports = {
  getContacts,
  updateContact,
  deleteContact,
  createContact,
  getContact,
};
