#
# Table structure for table 'tt_content'
#
CREATE TABLE tt_content
(
    relatedNews           int(1) DEFAULT '0' NOT NULL,
    switch                int(11) unsigned DEFAULT '0' NOT NULL,
    inline_item           int(11) unsigned DEFAULT '0' NOT NULL,
    inline_item_container int(11) unsigned DEFAULT '0' NOT NULL,
    inline_item_header    text,
    inline_layout         int(11) unsigned DEFAULT '1' NOT NULL,
    cta                   varchar(255) DEFAULT '' NOT NULL,
    cta_text              text,
    image_position        int(11) unsigned DEFAULT '0' NOT NULL,
    headline              text,
    remove_bottom_space   int(11) unsigned DEFAULT '0' NOT NULL,
    image_frontend_layout       int(11) unsigned DEFAULT '0' NOT NULL,
    button_style       int(11) unsigned DEFAULT '0' NOT NULL,
);

#
# Table structure for table 'tx_cbtemplate_domain_model_concerts'
#
CREATE TABLE tx_cbtemplate_domain_model_concerts
(
    title         text,
    subtitle      text,
    date          date        default NULL,
    time          text,
    composer      text,
    teaser        text,
    price         tinytext,
    ticket_link   text,
    description   text,
    location      text,
    concert_image int(11) unsigned DEFAULT '0' NOT NULL,
    categories    int(11) unsigned DEFAULT '0' NOT NULL,
);

#
# Table structure for table 'pages'
#
CREATE TABLE pages
(
    newsTeaser text,
);