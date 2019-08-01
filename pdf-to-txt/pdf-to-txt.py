# This file contains callable function to:
# 	1. convert PDF to txt file
# 	2. tokenize them
#	  3. cleans txt file so it can be fed to bot

# Simply import Converter and call pdf_to_txt() function and tokenize_and_clean() if "necessary"
# adjust W, L, M and B parameters accordingly before running file
# M is character margin, if m < M, then 2 chars will be considered as a single flowing line
# L is line margin, if l < L, then 2 lines will be considered within a box
# W is word margin, if m > M, then it will put in spaces to reflect the spacing in pdf
# B [-1, 1] where -1 prioritizes left-right, 1 prioritizes top-down reading
# try increments of 0.5 when unsure

# pip install PyPDF2, pdfminer.six and nltk from cmd beforehand
# please use python 3, if possible 3.6
# on python interpreter: import nltk, then nltk.download("punkt") to get the model for tokenizer
# then nltk.download("stopwords") to get stopwords corpus


# ------------------------------------------------------------------------------------------
# 19/12/18: adds line-splitter solver()
# 18/12/18: adds a new pdf_to_txt() function that can better control txt conversion
# 17/12/18: renew naming convention
# 13/12/18: this file can only read and convert non-scan PDF


import string
import PyPDF2
import subprocess

from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage
from pdfminer.pdfparser import PDFParser
from io import StringIO


def cmd_pdf2txt(pdf_file_obj_location):
	return None

def remove_line_splitter(pdf_file_obj_location):
	"""
	given some pdf file location, read its text
	and clean for linebreaks
	"""
	file = open("{}".format(pdf_file_obj_location), "rt", encoding="utf-8")
	text = file.read()

	# create list out of text so can edit word by word!
	l = text.split(" ")

	for i in range(len(l)):
		ids = l[i].find("\n")

		# this checks for "\n" in the beginning
		if ids == 0 and len(l[i]) != 0:

			# if the length of the item is 1, means it's just "\n" this, so skip it
			if len(l[i]) == 1:
				pass

			# if not, then it is "\nsomewords", replace this word and slot it in at same position
			else:
				new_word = l[i].replace("\n", "")
				l.pop(i)
				l.insert(i, new_word)
		else:
			pass

	string = ""

	# revert list to string
	for w in l:
		string += w + " "

	file.close()

	# set appropriate txt file name
	filename = pdf_file_obj_location.replace(".txt", "")

	# writes in binary because encoding, specify location here
	# writes string to clean txt
	doc = open("{}CLEAN.txt".format(filename), "wt", encoding="utf-8")
	doc.write(string)
	doc.close()

	return (string)

def pdf_to_txt(pdf_file_obj_location, char_margin=2.0, line_margin=0.5, word_margin=0.1, boxes_flow=0.5, pw=""):
	"""
	given PDF file location
	return string of text of the PDF content
	this one uses pdfminer instead of PyPDF2 and generally has more control
	over the margins
	"""

	M = char_margin
	L = line_margin
	W = word_margin
	B = boxes_flow

	rsc_mgr = PDFResourceManager()
	ret_str = StringIO()
	codec = "utf-8"
	laparams = LAParams(char_margin=M, line_margin=L, word_margin=W, boxes_flow=B)
	device = TextConverter(rsc_mgr, ret_str, codec=codec, laparams=laparams)

	# open file location
	fp = open(pdf_file_obj_location, "rb")
	# create parser object which is associated with the pdf object
	parser = PDFParser(fp)

	interpreter = PDFPageInterpreter(rsc_mgr, device)

	password = pw
	maxpages = 0
	caching = True
	pagenos = set()

	for page in PDFPage.get_pages(fp, pagenos, maxpages=maxpages, password=password,caching=caching, check_extractable=True):
		interpreter.process_page(page)

	string = ret_str.getvalue()
	fp.close()
	device.close()
	ret_str.close()

	# set appropriate txt file name
	filename = pdf_file_obj_location.replace(".pdf", "")

	# writes in binary because encoding, specify location here
	file = open("{}.txt".format(filename), "wb")
	file.write(string.encode("utf-8"))
	file.close()

	return (string.encode("utf-8"))

def pdf_to_txt_old(pdf_file_obj_location):
	"""
	given PDF file location
	return string of text of the PDF content
	"""
	# read file in binary
	pdf_file_obj = open("{}".format(pdf_file_obj_location), "rb")

	# pdfReader is obj representing PDF
	pdf_reader = PyPDF2.PdfFileReader(pdf_file_obj)

	print("successfully read {} pages of {}".format(pdf_reader.numPages, pdf_file_obj_location))

	# initialize empty string to store all future extracted strings
	string = ""

	# generate page object which represents each page
	# for each page obj, call extractText function to get strings
	# concatenate strings

	for page in range(pdf_reader.numPages):
		page_obj = pdf_reader.getPage(page)
		string += "\n\nPage {} \n\n ".format(page+1)
		string += page_obj.extractText()

	# set appropriate txt file name
	filename = pdf_file_obj_location.replace(".pdf", "")

	# writes in binary because encoding, specify location here
	file = open("{}.txt".format(filename), "wb")
	file.write(string.encode("utf-8"))
	file.close()

	return (string.encode("utf-8"))

def tokenize_and_clean(pdf_file_obj_location):
	"""
	given a txt file object locaiton
	this function will:
		1. tokenize the content word-by-word
		2. remove punctuations
		3. lower case all tokens
		4. remove non alphabetic tokens
		5. remove all stopwords
	return the list of tokens
	"""

	# read in text
	file = open("{}".format(pdf_file_obj_location), "rt", encoding="utf-8")
	text = file.read()

	# tokenize text using nltk
	token = word_tokenize(text)
	# turn all tokens into lower-case
	token = [w.lower() for w in token]

	# create a table of punctuations and use translate() to remove from each token
	punct_table = str.maketrans('', '', string.punctuation)
	token = [w.translate(punct_table) for w in token]

	# remove non alphabets
	token = [w for w in token if w.isalpha()]

	# lastly, set english stopwords and filter out those from token
	stopwords_set = set(stopwords.words("english"))
	token = [w for w in token if not w in stopwords_set]

	return (token)

# ------------------------------------------------------------------------------------------

if __name__ == "__main__":

	# specify file location here
	pdf_file_obj_location = "Boeing_737-300_400_500_Aircraft_Maintena.pdf"

	pdfa = subprocess.check_output(['ocrmypdf', pdf_file_obj_location])

	print (pdfa)

	print ("converting {} to txt file".format(pdf_file_obj_location))

	# specify char, line, word margin, boxes_flow | M, L, W, B = (2.0, 0.5, 0.1, 0.5)
	M = 2
	L = 0.5
	W = 0.1
	B = 0.5

	# Specify file location here!
	text = pdf_to_txt(pdf_file_obj_location, M, L, W, B)

	pdf_file_obj_location = pdf_file_obj_location.replace(".pdf", ".txt")

	words = tokenize_and_clean(pdf_file_obj_location)

	# Clean txt file
	print ("cleaning {} now...".format(pdf_file_obj_location))

	text = remove_line_splitter(pdf_file_obj_location)
	l = text.split("\n")
	# print (l)
	# this way each point is 1 item in the list, probably will help the bot in the long run
