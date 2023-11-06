const express = require('express');
const router = express.Router();
const axios = require('axios')
const client = require('../../config/pgadmindb')


router.get('/test', async (req, res) => { 
  try {
    let card_list = await axios.get(`https://db.ygoprodeck.com/api/v7/cardinfo.php`)
    .then(res => {
      return res.data.data
    })
    .catch(err => {
      console.log(err.message)
    })


    console.log()

    res.json({card: card_list[10]})
  } catch (error) {
    console.log('fail')
  }
})


router.get('/updateAll', async (req, res) => {
  try {
    let card_list = await axios.get(`https://db.ygoprodeck.com/api/v7/cardinfo.php`)
    .then(res => {
      return res.data.data
    })
    .catch(err => {
      console.log(err.message)
    })

    // TRUNCATE TABLE cards
    client.query('TRUNCATE TABLE cards', (err, res) => {
      if (err) {
        console.log(err)
      }
      else console.log('no err')
    })

    const cards = card_list
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i]

      const id = card.id
      const name = card.name.replaceAll(`'`, `''`)
      const type = card.type
      const frametype = card.frameType
      const description = card.desc.replaceAll(`'`, `''`)
      const atk = card.atk
      const def = card.def
      const level = card.level
      const race = card.race
      const attribute = card.attribute
      const archetype = card.archetype?.replaceAll(`'`, `''`)
      const image_id = card.card_images[0].id
      const image_url = card.card_images[0].image_url
      const image_url_small = card.card_images[0].image_url_small
      const image_url_cropped = card.card_images[0].image_url_cropped

      client.query(`INSERT INTO cards (id, name, type, frametype, description, atk, def, race, attribute, archetype, image_id, image_url, image_url_small, image_url_cropped, level) VALUES ('${id}', '${name}', '${type}', '${frametype}', '${description}', '${atk}', '${def}', '${race}', '${attribute}', '${archetype}', '${image_id}', '${image_url}', '${image_url_small}', '${image_url_cropped}', '${level}')`, (err, res) => {
        if (err) {
          console.log('ERROR')
          console.log(name)
          console.log(err)
        }
        else console.log('no err')
      })
    }

    res.json(cards)
    
  } catch (error) {
    console.log("Could not request promise")
    res.json({

    })
  }
});


router.get('/card', async (req, res) => {
  try {
    client.query(`SELECT * FROM cards WHERE id = '${req.query.id}'`, (psqlErr, psqlRes) => {
      if (psqlErr) {
        console.log('not hit')
      }

      res.json({msg:'good', card: psqlRes.rows})
    })

  } catch (error) {
    console.log("Could not reach api/crypto/all")
    res.json({})
  }
});

// type, name, atk, def, levle,  attribute, description, frameType, archetype
//paginate?field=fieldhere&searchQuery=searchqueryhere&sortType=(ASC/DESC)&page=#
router.get('/paginate', async (req, res) => {
  try {
    let field = req.query.field
    let query = req.query.searchQuery
    let sortType = req.query.sortType
    let page = req.query.page

    if (!field || !query || !sortType || !page) {
      res.json({ errorMessage: "Incorrect query parameters" })
      return
    }

    client.query(`SELECT * FROM cards WHERE ${field} iLIKE '%${query}%' ORDER BY name ${sortType} LIMIT 15 OFFSET ${page}`, (psqlErr, psqlRes) => {
      if (psqlErr) {
        console.log('not hit')
      }

      res.json({cards: psqlRes.rows})
    })

  } catch (error) {
    console.log("Could not reach api/crypto/all")
    res.json({})
  }
});




//exporter
module.exports = router;