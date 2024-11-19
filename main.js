// Authentication State
let isLoggedIn = false;
let currentUser = null;

// Initialize local storage
const initializeStorage = () => {
  if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify([]));
  }
  if (!localStorage.getItem("complaints")) {
    localStorage.setItem("complaints", JSON.stringify([]));
  }
};

// Page Navigation
window.showPage = (pageId) => {
  if (pageId !== "auth" && pageId !== "articles" && !isLoggedIn) {
    alert("Please login first");
    pageId = "auth";
  }

  document.querySelectorAll(".page").forEach((page) => {
    page.classList.add("hidden");
  });

  document.getElementById(`${pageId}Page`).classList.remove("hidden");

  if (pageId === "articles") {
    loadArticles();
  }
  if (pageId === "complaint") {
    displayUserComplaints();
  }
};

// Authentication Handling
window.toggleAuth = () => {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const authButton = document.getElementById("authButton");

  loginForm.classList.toggle("hidden");
  signupForm.classList.toggle("hidden");

  if (loginForm.classList.contains("hidden")) {
    authButton.textContent = "Logout"; // If logged in, show Logout
  } else {
    authButton.textContent = "Login"; // Otherwise, show Login
  }
};

window.handleLogin = (event) => {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const users = JSON.parse(localStorage.getItem("users"));
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    isLoggedIn = true;
    currentUser = user;
    document.getElementById("authButton").textContent = "Logout";
    showPage("articles");
  } else {
    alert("Invalid credentials");
  }
};

window.handleSignup = (event) => {
  event.preventDefault();
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  const users = JSON.parse(localStorage.getItem("users"));
  if (users.some((u) => u.email === email)) {
    alert("Email already exists");
    return;
  }

  users.push({ name, email, password });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Signup successful! Please login.");
  toggleAuth();
};

document.getElementById("authButton").addEventListener("click", () => {
  if (isLoggedIn) {
    isLoggedIn = false;
    currentUser = null;
    document.getElementById("authButton").textContent = "Login";
    showPage("auth");
  } else {
    toggleAuth();
  }
});

// Articles and Modal Handling
const articles = [
  {
    title: "Climate Change Impact",
    content: "Understanding the global effects of climate change...",
    details: "Climate change is one of the most pressing issues of our time. It affects ecosystems, weather patterns, and human livelihoods. In this article, we delve into the science behind climate change and explore its global impact.",
    image: "media/climate.jpg",
  },
  {
    title: "Sustainable Living",
    content: "Tips for reducing your environmental footprint...",
    details: "Sustainable living focuses on reducing one's environmental impact through actions such as reducing waste, conserving energy, and adopting eco-friendly practices.",
    image: "media/sustainable.jpeg",
  },
  {
    title: "Ocean Conservation",
    content: "Protecting marine ecosystems and biodiversity...",
    details: "Ocean conservation is essential for maintaining biodiversity. This article explores the impact of pollution, overfishing, and climate change on marine life.",
    image: "media/ocean.jpg",
  },
];

// Load articles dynamically on page load
const loadArticles = () => {
  const articlesList = document.getElementById("articlesList");
  articlesList.innerHTML = articles
    .map(
      (article, index) => `
        <div class="flex flex-col bg-white rounded-lg shadow-md overflow-hidden cursor-pointer" data-index="${index}">
            <img src="${article.image}" alt="${article.title}" class="object-contain h-36 m-5">
            <div class="p-4">
                <h3 class="text-xl font-bold mb-2">${article.title}</h3>
                <p class="text-gray-600">${article.content}</p>
            </div>
        </div>
    `
    )
    .join("");

  // Add event listeners to each article card after they are loaded
  document.querySelectorAll('#articlesList .cursor-pointer').forEach(card => {
    card.addEventListener('click', (event) => {
      const index = event.currentTarget.getAttribute('data-index');
      openArticleModal(index);
    });
  });
};

// Open article modal and display content
const openArticleModal = (index) => {
  const article = articles[index];
  const modalTitle = document.getElementById("modalTitle");
  const modalImage = document.getElementById("modalImage");
  const modalContent = document.getElementById("modalContent");

  modalTitle.textContent = article.title;
  modalContent.innerHTML = `
    <p><strong>Introduction:</strong> ${article.content}</p>
    <p><strong>Details:</strong> ${article.details}</p>
  `;
  modalImage.src = article.image;
  modalImage.alt = article.title;
  modalImage.style.display = "block";

  // Show the modal
  document.getElementById("articleModal").classList.remove("hidden");
};

// Close the modal when the close button is clicked
document.getElementById("closeModalBtn").addEventListener("click", () => {
  document.getElementById("articleModal").classList.add("hidden");
});

// Optionally, close the modal when clicking outside the modal content
document.getElementById("articleModal").addEventListener("click", (e) => {
  if (e.target === document.getElementById("articleModal")) {
    document.getElementById("articleModal").classList.add("hidden");
  }
});

// Initialize articles when the page loads
document.addEventListener("DOMContentLoaded", loadArticles);

// Complaint Handling
window.handleComplaint = (event) => {
  event.preventDefault();

  const subject = document.getElementById("complaintSubject").value;
  const description = document.getElementById("complaintDescription").value;
  const mediaFile = document.getElementById("complaintMedia").files[0];

  const trackingId = Math.random().toString(36).substr(2, 9);

  const complaintData = {
    trackingId,
    subject,
    description,
    userId: currentUser.email,
    status: "Pending",
    date: new Date().toISOString(),
  };

  if (mediaFile) {
    complaintData.mediaFileName = mediaFile.name;
    complaintData.mediaFileType = mediaFile.type;
  }

  addComplaint(complaintData);

  const newComplaintCard = createComplaintCard(complaintData);
  const userComplaints = document.getElementById("userComplaints");
  userComplaints.insertAdjacentHTML("afterbegin", newComplaintCard);

  alert(`Complaint submitted successfully! Your tracking ID is: ${trackingId}`);
  event.target.reset();
};

// Contact Form
window.handleContact = (event) => {
  event.preventDefault();
  alert("Thank you for your message. We will get back to you soon!");
  event.target.reset();
};

// Initialize
initializeStorage();
showPage("auth");

// Complaint Management Functions
const createComplaintCard = (complaint) => {
  return `
    <div class="bg-white rounded-lg shadow-md p-6 mb-4">
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-green-600">Tracking ID: ${complaint.trackingId}</h3>
            <span class="px-3 py-1 rounded-full text-sm ${complaint.status === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}">${complaint.status}</span>
        </div>
        <div class="mb-2">
            <span class="font-semibold">Subject:</span> ${complaint.subject}
        </div>
        <div class="mb-2">
            <span class="font-semibold">Description:</span>
            <p class="text-gray-600">${complaint.description}</p>
        </div>
        <div class="text-sm text-gray-500">
            Submitted on: ${new Date(complaint.date).toLocaleDateString()}
        </div>
    </div>
  `;
};

const getUserComplaints = (userEmail) => {
  const complaints = JSON.parse(localStorage.getItem("complaints") || "[]");
  return complaints.filter((complaint) => complaint.userId === userEmail);
};

const addComplaint = (complaintData) => {
  const complaints = JSON.parse(localStorage.getItem("complaints") || "[]");
  complaints.push(complaintData);
  localStorage.setItem("complaints", JSON.stringify(complaints));
};

const displayUserComplaints = () => {
  if (!currentUser) return;

  const complaints = getUserComplaints(currentUser.email);
  const complaintsContainer = document.getElementById("userComplaints");

  if (complaints.length === 0) {
    complaintsContainer.innerHTML = `
      <div class="text-center text-gray-600 py-8">
          No complaints submitted yet.
      </div>
    `;
    return;
  }

  complaintsContainer.innerHTML = complaints
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map(createComplaintCard)
    .join("");
};
