# EduMate Pro

using this code design website def get_year(max_year):

    return int(input(f"Enter year (1-{max_year}): "))

# ---------- ACADEMIC DETAILS ----------

level = input("Enter level (School/College): ").lower()

if level == "school":

    school = input("Enter school name: ")

    class_name = int(input("Enter class (1-12): "))

    academic = [school, "School", class_name, None, None, None]

elif level == "college":

    college = input("Enter college name: ")

    print("\n1. Science & Engineering")

    print("2. Commerce & Management")

    print("3. Arts, Humanities & Social Sciences")

    stream = int(input("Enter stream: "))

    if stream == 1:

        print("\n1. B.Tech / B.E")

        print("2. MBBS")

        print("3. B.Sc")

        print("4. BDS")

        choice = int(input("Enter course: "))

        courses = {

            1: ("B.Tech / B.E", 4),

            2: ("MBBS", 5),

            3: ("B.Sc", 3),

            4: ("BDS", 5)

        }

        course, max_year = courses[choice]

        year = get_year(max_year)

        branch = specialization = None

        if choice == 1:

            print("\n1. CSE")

            print("2. ECE")

            print("3. Civil")

            print("4. IT")

            print("5. EEE")

            print("6. CSE Specialization")

            branches = [

                "CSE", "ECE", "Civil", "IT", "EEE",

                "CSE Specialization"

            ]

            branch = branches[int(input("Enter branch: ")) - 1]

            if branch == "CSE Specialization":

                specializations = [

                    "CSE (AI & ML)",

                    "CSE (AI & Data Science)",

                    "CSE (Cyber Security)",

                    "CSE (Data Science)",

                    "CSE (IoT)"

                ]

                print("\nCSE Specializations:")

                for i, x in enumerate(specializations, 1):

                    print(i, x)

                specialization = specializations[

                    int(input("Enter specialization: ")) - 1

                ]

        stream = "Science & Engineering"

    elif stream == 2:

        courses = [

            ("B.Com", 3),

            ("BBA", 3),

            ("BMS", 3),

            ("BBA LL.B", 5)

        ]

        print("\n1. B.Com")

        print("2. BBA")

        print("3. BMS")

        print("4. BBA LL.B")

        course, max_year = courses[

            int(input("Enter course: ")) - 1

        ]

        year = get_year(max_year)

        branch = specialization = None

        stream = "Commerce & Management"

    elif stream == 3:

        courses = [

            ("B.A", 3),

            ("BCA", 3),

            ("B.F.A", 4),

            ("LL.B", 3)

        ]

        print("\n1. B.A")

        print("2. BCA")

        print("3. B.F.A")

        print("4. LL.B")

        course, max_year = courses[

            int(input("Enter course: ")) - 1

        ]

        year = get_year(max_year)

        branch = specialization = None

        stream = "Arts, Humanities & Social Sciences"

    academic = [

        college, stream, year, course, branch, specialization

    ]

else:

    print("Invalid level")

    exit()

# ---------- STUDENT DETAILS ----------

n = int(input("\nEnter number of students: "))

students = []

for i in range(n):

    print(f"\nStudent {i + 1}")

    roll = input("Roll number: ")

    name = input("Name: ")

    section = input("Section: ")

    subjects = int(input("Number of subjects: "))

    total = 0

    for j in range(subjects):

        total += float(input(f"Marks {j + 1}: "))

    students.append([roll, name, section, total])

# ---------- DISPLAY ----------

print("\n========== ACADEMIC DETAILS ==========")

if level == "school":

    print("School :", academic[0])

    print("Class  :", academic[2])

else:

    print("College :", academic[0])

    print("Stream  :", academic[1])

    print("Course  :", academic[3])

    print("Year    :", academic[2])

    if academic[4]:

        print("Branch  :", academic[4])

    if academic[5]:

        print("Specialization :", academic[5])

print("\n========== STUDENTS ==========")

for student in students:

    print("\nRoll No :", student[0])

    print("Name    :", student[1])

    print("Section :", student[2])

    print("Total   :", student[3]). in proffesional manner

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://edu-buddy-finder-17.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a7ef1b44-dbeb-573a-992b-7c1231318d1e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
