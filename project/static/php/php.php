<?php
// Array with names
$a[] = "Paul Hoffman";
$a[] = "THE LEFT HAND OF COD";
$a[] = "Paul Hoffman";
$a[] = "THE LAST FOUR THINGS";
$a[] = "Kimbra Swain";
$a[] = "THE YOUNG ILLMISTAKY";
$a[] = "Kimbra Swain";
$a[] = "CIFTOEARTH BOOK 3";
$a[] = "Eric Berne MD";
$a[] = "GAMES PEOPLE PLAY";
$a[] = "Eric Berne MD";
$a[] = "THE PSYCHOLOGY OF HUMAN RELATIONSHIPS";
$a[] = "Josh Belder";
$a[] = "Semantic Web Programming";
$a[] = "Matthew Fisher";
$a[] = "Web DEVELOPMENT FOR BEGINNERS";
$a[] = "Jonathon Barrett";
$a[] = "Programming for Absolute Beginners";
$a[] = "Various";
$a[] = "APTESS";
$a[] = "John Hebeier";
$a[] = "Anonymous 705";
$a[] = "Jonathon Barrett";
$a[] = "Novel";
$a[] = "Psychology";
$a[] = "Programming";

// get the q parameter from URL
$q = $_REQUEST["q"];

$hint = "";

// lookup all hints from array if $q is different from ""
if ($q !== "") {
  $q = strtolower($q);
  $len=strlen($q);
  foreach($a as $name) {
    if (stristr($q, substr($name, 0, $len))) {
      if ($hint === "") {
        $hint = $name;
      } else {
        $hint .= ", $name";
      }
    }
  }
}

// Output "no suggestion" if no hint was found or output correct values
echo $hint === "" ? "no suggestion" : $hint;
?>