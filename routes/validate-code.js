const express = require('express');

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  QueryCommand,
} = require('@aws-sdk/lib-dynamodb');

// Set up DynamoDB client
const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(ddbClient);

const router = express.Router();

router.get('/validate-invitation-code', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Missing id query param' });
  }

  const params = {
    TableName: 'InvitationTable',
    KeyConditionExpression: '#pk = :pkVal',
    ExpressionAttributeNames: {
      '#pk': 'ProjectMorkx', // attribute name for the partition key
    },
    ExpressionAttributeValues: {
      ':pkVal': 'data', // value you're querying for
    },
  };

  try {
    const data = await docClient.send(new QueryCommand(params));

    // validate code
    const inviteCode = data.Items?.[0]?.data.find(
      (invitationObj) => invitationObj.code === code
    );

    if (!inviteCode) {
      return res.status(400).json({ error: 'Invalid invitation code' });
    }

    if (inviteCode.expiration_date) {
      res.json(inviteCode);
    }

    const now = new Date();
    const expirationDate = new Date(inviteCode.expiration_date);

    if (expirationDate < now) {
      return res.status(400).json({ error: 'Invitation code has expired' });
    }

    res.json(inviteCode);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
