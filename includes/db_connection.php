<?php

      define('DB_SERVER', 'localhost');
      define('DB_USER', 'sloanisa_test');
      define('DB_PASS', 'EAPD4o5gTr15');
      define('DB_NAME', 'sloanisa_concierto');

      $connection = mysqli_connect(DB_SERVER, DB_USER, DB_PASS, DB_NAME);

      if (mysqli_connect_errno()) {
        die ('Database connection failed: ' .
            mysqli_connect_error() .
            ' )' . mysqli_connect_errno() . ')'
        );
      }
?>
